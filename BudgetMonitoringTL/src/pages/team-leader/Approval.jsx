import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { Container } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";
import { STATUS } from "../../constants/status";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import ExpenseReport from "../../components/print/ExpenseReport";
import AppButton from "../../components/ui/AppButton";

const PrintButton = ({ onClick }) => (
  <AppButton
    label={
      <>
        <MdLocalPrintshop style={{ marginRight: "5px" }} />
        Print
      </>
    }
    size="sm"
    className="custom-app-button"
    variant="outline-dark"
    onClick={onClick}
  />
);

const DeleteButton = ({ onClick }) => (
  <AppButton
    label={
      <>
        <MdDelete style={{ marginRight: "5px" }} />
        Delete
      </>
    }
    size="sm"
    className="custom-app-button"
    variant="outline-danger"
    onClick={onClick}
  />
);

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  useEffect(() => {
    setTableData([]);
  }, []);

  const approvedData = useMemo(
    () => tableData.filter((item) => item.status === STATUS.APPROVED),
    [tableData]
  );

  const filteredData = useMemo(() => {
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();

    return approvedData.filter((item) =>
      columns.some((col) =>
        normalize(item[col.accessor]).includes(normalize(searchValue))
      )
    );
  }, [approvedData, searchValue]);

  const selectedEntry =
    selectedCount === 1
      ? filteredData.find((item) => selectedRows[item.id])
      : null;

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handlePrint = () => {
    if (!selectedEntry) return;
    setPrintData(selectedEntry);
    setTimeout(() => reactToPrintFn(), 100);
  };

  const handleMoveEntry = (entry, newStatus) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.id === entry.id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleDeleteSelected = () => {
    if (selectedCount < 1) return;
    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );
    setTableData((prev) =>
      prev.filter(
        (entry) => !selectedEntries.some((sel) => sel.id === entry.id)
      )
    );
    setSelectedRows({});
  };

  const totalComputationData = useMemo(() => tableData, [tableData]);

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={TEAMLEAD_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            leftContent={
              selectedCount > 0 && (
                <>
                  {selectedCount === 1 && (
                    <>
                      <PrintButton onClick={handlePrint} />
                      <DeleteButton onClick={handleDeleteSelected} />
                    </>
                  )}
                  {selectedCount > 1 && (
                    <DeleteButton onClick={handleDeleteSelected} />
                  )}
                </>
              )
            }
            selectedCount={selectedCount}
          />

          <DataTable
            data={filteredData}
            height="455px"
            columns={columns}
            onRowClick={handleRowClick}
            onDelete={(entry) => handleMoveEntry(entry, STATUS.DELETED)}
            onArchive={(entry) => handleMoveEntry(entry, STATUS.ARCHIVED)}
            onToggleImportant={(entry) =>
              handleMoveEntry(entry, STATUS.IMPORTANT)
            }
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            downloadRef={downloadRef}
            setPrintData={setPrintData}
          />

          <div className="d-none">
            <ExpenseReport contentRef={contentRef} data={printData || {}} />
            <ExpenseReport contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Approval;

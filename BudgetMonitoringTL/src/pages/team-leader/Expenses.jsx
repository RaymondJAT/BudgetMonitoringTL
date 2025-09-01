import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { Container } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";

import { columns } from "../../handlers/tableHeader";
import { formatPrintData } from "../../utils/formatPrintData";
import { handleExportData } from "../../utils/exportItems";
import { STATUS } from "../../constants/status";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";

import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";
import ExpenseReport from "../../components/print/ExpenseReport";
import AppButton from "../../components/ui/AppButton";
import TotalCards from "../../components/TotalCards";

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
    variant="outline-secondary"
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

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [particulars, setParticulars] = useState([]);
  const [printData, setPrintData] = useState(null);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  useEffect(() => {
    setTableData([]);
  }, []);

  useEffect(() => {
    const items = formatPrintData(tableData);
    const isSame = JSON.stringify(particulars) === JSON.stringify(items);
    if (!isSame) setParticulars(items);
  }, [tableData]);

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/approval-form", { state: entry });
    } else if (entry.formType === "Liquidation") {
      navigate("/liquidation-form", { state: entry });
    }
  };

  const handlePrint = () => {
    if (!selectedEntry) return;
    setPrintData(selectedEntry);
    setTimeout(() => reactToPrintFn(), 100);
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fieldsToSearch = [...columns.map((col) => col.accessor), "formType"];
    return fieldsToSearch.some((key) =>
      normalize(item[key]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () =>
      tableData
        .filter(
          (item) =>
            item.status !== STATUS.APPROVED && item.status !== STATUS.REJECTED
        )
        .filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  const selectedEntry =
    selectedCount === 1
      ? filteredData.find((item) => selectedRows[item.id])
      : null;

  const handleDelete = (entryToDelete) => {
    setTableData((prev) => prev.filter((item) => item.id !== entryToDelete.id));
  };

  const handleDeleteSelected = () => {
    if (selectedCount < 1) return;
    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );
    setTableData((prev) =>
      prev.filter((item) => !selectedEntries.some((e) => e.id === item.id))
    );
    setSelectedRows({});
  };

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "Expenses",
    });
    setSelectedRows(resetSelection);
  };

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={tableData} list={TEAMLEAD_STATUS_LIST} />
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
            handleExport={handleExport}
            selectedCount={selectedCount}
          />

          <DataTable
            data={filteredData}
            height="450px"
            columns={columns}
            onRowClick={handleRowClick}
            onDelete={handleDelete}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            downloadRef={downloadRef}
            setPrintData={setPrintData}
          />

          {/* hidden print/download */}
          <div className="d-none">
            <ExpenseReport contentRef={contentRef} data={printData || {}} />
            <ExpenseReport contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Expenses;

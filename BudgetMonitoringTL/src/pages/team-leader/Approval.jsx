import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MdLocalPrintshop, MdDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { Container } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";
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
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  // Fetch only approved and completed expenses
  const fetchApprovedAndCompleted = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api5012/cash_request/getcash_request?status=approved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok)
        throw new Error("Failed to fetch approved/completed requests");

      const result = await res.json();
      const mappedData = (result || []).map((item, index) => ({
        ...item,
        id: item.id ?? `${index}`,
        formType: "Cash Request",
      }));

      // Safety filter: only keep approved or completed
      setTableData(
        mappedData.filter((item) =>
          ["approved", "completed"].includes(item.status.toLowerCase())
        )
      );
    } catch (err) {
      console.error("Error fetching approved/completed requests:", err);
    }
  }, []);

  useEffect(() => {
    fetchApprovedAndCompleted();
  }, [fetchApprovedAndCompleted]);

  const filteredData = useMemo(() => {
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();
    return tableData.filter((item) =>
      columns.some((col) =>
        normalize(item[col.accessor]).includes(normalize(searchValue))
      )
    );
  }, [tableData, searchValue]);

  const handleRowClick = (entry) => {
    navigate("/cash_approval_form", { state: entry });
  };

  const selectedEntry =
    selectedCount === 1
      ? filteredData.find((item) => selectedRows[item.id])
      : null;

  const handlePrint = () => {
    if (!selectedEntry) return;
    setPrintData(selectedEntry);
    setTimeout(() => reactToPrintFn(), 100);
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
      filename: "Approved_Completed",
    });
    setSelectedRows(resetSelection);
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
            handleExport={handleExport}
            selectedCount={selectedCount}
          />

          <DataTable
            data={filteredData}
            height="455px"
            columns={columns}
            onRowClick={handleRowClick}
            onDelete={(entry) =>
              setTableData((prev) =>
                prev.filter((item) => item.id !== entry.id)
              )
            }
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            downloadRef={downloadRef}
            setPrintData={setPrintData}
          />

          <div style={{ display: "none" }}>
            <ExpenseReport contentRef={contentRef} data={printData || {}} />
            <ExpenseReport contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Approval;

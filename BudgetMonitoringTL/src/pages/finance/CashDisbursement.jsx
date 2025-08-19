import { useState, useEffect, useMemo } from "react";
import { Container, Form } from "react-bootstrap";
import { FaPlus, FaEdit } from "react-icons/fa";
import { LuFolderCheck } from "react-icons/lu";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { cashDisbursementColumns as baseColumns } from "../../constants/BudgetingColumn";
import { LOCAL_KEYS } from "../../constants/localKeys";

import { handleExportData } from "../../utils/exportItems";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import AppButton from "../../components/ui/AppButton";
import NewCashDisbursement from "../../components/ui/modal/admin/NewCashDisbursement";
import SubmitCashDisbursement from "../../components/ui/modal/admin/SubmitCashDisbursement";

const CashDisbursement = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fields = [...baseColumns.map((col) => col.accessor), "formType"];
    return fields.some((key) =>
      normalize(item[key]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () => tableData.filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  const fetchCashDisbursements = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/cash_disbursement/getcash_disbursement", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch cash disbursement data");

      const result = await res.json();
      const sorted = [...(result.data || [])].sort((a, b) => b.id - a.id);
      setTableData(sorted);
    } catch (error) {
      console.error("Fetch error:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashDisbursements();
  }, []);

  const handleAddDisbursementItem = () => {
    fetchCashDisbursements();
  };

  const handleExport = () => {
    const reset = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "CashDisbursement",
    });
  };

  const selectAllCheckbox = (
    <Form.Check
      type="checkbox"
      checked={
        filteredData.length > 0 &&
        filteredData.every((entry) => selectedRows[entry.id])
      }
      onChange={(e) => {
        const checked = e.target.checked;
        const newSelection = {};
        filteredData.forEach((entry) => {
          newSelection[entry.id] = checked;
        });
        setSelectedRows(newSelection);
      }}
      className="d-lg-none"
      style={{ marginTop: "3px" }}
      title="Select All"
    />
  );

  const leftContent = (
    <div className="d-flex align-items-center gap-2">
      {selectAllCheckbox}
      <AppButton
        label={
          <>
            <FaPlus />
            <span className="d-none d-sm-inline ms-1">Cash Disbursement</span>
          </>
        }
        size="sm"
        variant="outline-dark"
        onClick={() => setShowModal(true)}
        className="custom-app-button"
      />
    </div>
  );

  const columns = baseColumns.map((col) => {
    if (col.accessor === "actions") {
      return {
        ...col,
        Cell: ({ row }) => {
          const rowData = row.original || row;
          return (
            <div className="d-flex gap-1">
              <AppButton
                key="submit"
                label={<LuFolderCheck />}
                variant="outline-success"
                className="custom-app-button"
                onClick={() => {
                  setSelectedDisbursement(rowData);
                  setShowSubmitModal(true);
                }}
              />
              <AppButton
                key="edit"
                label={<FaEdit />}
                variant="outline-dark"
                className="custom-app-button"
                onClick={() => console.log("Editing", rowData)}
              />
            </div>
          );
        },
      };
    }
    return col;
  });

  return (
    <>
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-3">
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            leftContent={leftContent}
            handleExport={handleExport}
            selectedCount={selectedCount}
            searchBarWidth="300px"
          />

          <NewCashDisbursement
            show={showModal}
            onHide={() => setShowModal(false)}
            onAdd={handleAddDisbursementItem}
          />

          {loading ? (
            <p className="text-muted">Loading cash disbursement data...</p>
          ) : (
            <DataTable
              data={filteredData}
              columns={columns}
              height="350px"
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              showActions={false}
              showCheckbox={false}
            />
          )}

          <SubmitCashDisbursement
            show={showSubmitModal}
            onHide={() => setShowSubmitModal(false)}
            disbursement={selectedDisbursement}
          />
        </div>
      </Container>
    </>
  );
};

export default CashDisbursement;

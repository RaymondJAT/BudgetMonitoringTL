import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { columns } from "../../handlers/tableHeader";
import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";

import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import DataTable from "../../components/layout/DataTable";
import CashReqModal from "../../components/ui/modal/employee/CashReqModal";
import LiqFormModal from "../../components/ui/modal/employee/LiqFormModal";
import TotalCards from "../../components/TotalCards";

const MyExpenses = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showCashReqModal, setShowCashReqModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);
  const navigate = useNavigate();

  const fetchCashRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api5012/cash_request/getcash_request", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch cash requests");

      const result = await res.json();
      const mappedData = (result || []).map((item) => ({
        ...item,
        id: item.cr_id,
        formType: "Cash Request",
      }));
      setTableData(mappedData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  // fetch once on mount
  useEffect(() => {
    fetchCashRequests();
  }, [fetchCashRequests]);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const totalComputationData = useMemo(() => tableData, [tableData]);

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const filteredData = useMemo(
    () =>
      tableData.filter((item) =>
        [...columns.map((col) => col.accessor), "formType"].some((key) =>
          normalize(item[key]).includes(normalize(searchValue))
        )
      ),
    [tableData, searchValue]
  );

  const handleRowClick = (entry) => {
    navigate(
      entry.formType === "Cash Request" ? "/view_cash_request" : "/liquid-form",
      { state: entry }
    );
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
        filteredData.forEach((entry) => (newSelection[entry.id] = checked));
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
            <span className="d-none d-sm-inline ms-1">Request</span>
          </>
        }
        size="sm"
        variant="outline-dark"
        onClick={() => setShowCashReqModal(true)}
        className="custom-app-button"
      />
    </div>
  );

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={EMPLOYEE_STATUS_LIST} />
      </div>
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            leftContent={leftContent}
            selectedCount={selectedCount}
            searchBarWidth="300px"
          />

          <DataTable
            data={filteredData}
            height="350px"
            columns={columns}
            onRowClick={handleRowClick}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
          />

          {/* CASH REQUEST MODAL */}
          <CashReqModal
            show={showCashReqModal}
            onHide={() => setShowCashReqModal(false)}
            onSubmit={fetchCashRequests}
          />

          {/* LIQUIDATION MODAL */}
          <LiqFormModal
            show={showLiqFormModal}
            onHide={() => setShowLiqFormModal(false)}
            onSubmit={(newForm) =>
              setTableData((prev) => [
                { ...newForm, formType: "Liquidation", id: newForm.cr_id },
                ...prev,
              ])
            }
          />
        </div>
      </Container>
    </div>
  );
};

export default MyExpenses;

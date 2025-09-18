import { useState, useEffect, useMemo } from "react";
import { Container, Form } from "react-bootstrap";
import { FaPlus, FaEdit } from "react-icons/fa";
import { LuFolderCheck } from "react-icons/lu";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { cashDisbursementColumns as baseColumns } from "../../constants/BudgetingColumn";
import { handleExportData } from "../../utils/exportItems";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import AppButton from "../../components/ui/AppButton";
import NewCashDisbursement from "../../components/ui/modal/admin/NewCashDisbursement";
import SubmitCashDisbursement from "../../components/ui/modal/admin/SubmitCashDisbursement";
import EditCashDisbursement from "../../components/ui/modal/admin/EditCashDisbursement";

const CashDisbursement = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);

  const [showNewModal, setShowNewModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDisbursement, setSelectedDisbursement] = useState(null);
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const totalComputationData = useMemo(() => [...tableData], [tableData]);

  const normalize = (val) =>
    String(val || "")
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
    if (!token) return setLoading(false);

    try {
      const res = await fetch(
        "/api5001/cash_disbursement/getcash_disbursement",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch disbursement data");

      const result = await res.json();
      const sorted = [...(result.data || [])].sort((a, b) => b.id - a.id);
      setTableData(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisbursementDataByDate = async (
    startDate,
    endDate,
    status = ""
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formatDate = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
    };

    try {
      const start = startDate ? formatDate(startDate) : "";
      let end = endDate
        ? formatDate(new Date(endDate).setHours(23, 59, 59, 999))
        : "";

      let url = `/api5001/cash_disbursement/getcash-disbursement-target`;
      if (start) url += `/${start}`;
      if (end) url += `/${end}`;
      if (status) url += `/${status}`;

      console.log("📡 Fetching:", url);

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const result = await res.json();
      setTableData(result.data || []);
    } catch (err) {
      console.error("Error fetching by date:", err);
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchCashDisbursements();
  }, []);

  // TOTAL CARDS
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_finance_cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Finance cards API error:", text);
          return;
        }

        const data = await res.json();
        const finance = data[0] || {};

        const enrichedData = FINANCE_STATUS_LIST.map((item) => ({
          ...item,
          value: finance[item.key] ?? 0,
          subValue: item.subKey ? finance[item.subKey] ?? 0 : undefined,
        }));

        setCardsData(enrichedData);
      } catch (err) {
        console.error("Error fetching finance cards:", err);
      }
    };

    fetchCards();
  }, []);

  const handleExport = () =>
    handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "CashDisbursement",
    });

  const handleSelectAll = (checked) => {
    const selection = {};
    filteredData.forEach((entry) => (selection[entry.id] = checked));
    setSelectedRows(selection);
  };

  const selectAllCheckbox = (
    <Form.Check
      type="checkbox"
      checked={
        filteredData.length > 0 &&
        filteredData.every((entry) => selectedRows[entry.id])
      }
      onChange={(e) => handleSelectAll(e.target.checked)}
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
        className="custom-app-button"
        onClick={() => setShowNewModal(true)}
      />
    </div>
  );

  const columns = baseColumns.map((col) =>
    col.accessor === "actions"
      ? {
          ...col,
          Cell: ({ row }) => {
            const rowData = row.original || row;

            const isReturnOrReimburse = ["RETURN", "REIMBURSE"].includes(
              String(rowData.particulars).toUpperCase()
            );

            const buttons = [];

            if (isReturnOrReimburse) {
              buttons.push(
                <AppButton
                  key="edit"
                  label={<FaEdit />}
                  variant="outline-dark"
                  className="custom-app-button"
                  onClick={() => {
                    setSelectedDisbursement(rowData);
                    setShowEditModal(true);
                  }}
                />
              );
            } else {
              if (String(rowData.status).toUpperCase() === "UNLIQUIDATED") {
                buttons.push(
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
                );
              }

              buttons.push(
                <AppButton
                  key="edit"
                  label={<FaEdit />}
                  variant="outline-dark"
                  className="custom-app-button"
                  onClick={() => {
                    setSelectedDisbursement(rowData);
                    setShowEditModal(true);
                  }}
                />
              );
            }

            return (
              <div
                className={`d-flex gap-1 ${
                  buttons.length === 1 ? "justify-content-center" : ""
                }`}
              >
                {buttons}
              </div>
            );
          },
        }
      : col
  );

  return (
    <>
      <div className="mt-3">
        <TotalCards data={cardsData} list={FINANCE_STATUS_LIST} />
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
            onDateRangeChange={(start, end) =>
              fetchDisbursementDataByDate(start, end)
            }
          />

          <NewCashDisbursement
            show={showNewModal}
            onHide={() => setShowNewModal(false)}
            onAdd={fetchCashDisbursements}
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

          <EditCashDisbursement
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            disbursement={selectedDisbursement}
            onSuccess={fetchCashDisbursements}
          />
        </div>
      </Container>
    </>
  );
};

export default CashDisbursement;

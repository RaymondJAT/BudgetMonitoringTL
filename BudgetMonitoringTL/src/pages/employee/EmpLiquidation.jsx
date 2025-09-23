import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";
import { liquidationColumns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";
import LiquidationPdf from "../../components/print/LiquidationPdf";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const EmpLiquidation = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState([EMPLOYEE_STATUS_LIST]);
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  const fetchLiquidations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const employeeId = localStorage.getItem("employee_id");
      const accessName = localStorage.getItem("access_name");

      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api5012/liquidation/getcash_liquidation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch liquidations");

      const result = await response.json();

      const filtered =
        String(accessName) === "Administrator"
          ? result || []
          : (result || []).filter((item) => {
              const apiEmpId = String(
                item.employee_id ||
                  item.emp_id ||
                  item.employeeId ||
                  item.created_by ||
                  ""
              ).trim();
              const localEmpId = String(employeeId || "").trim();
              return apiEmpId === localEmpId;
            });

      const mappedData = filtered.map((item, index) => ({
        ...item,
        id: item.id ?? `${index}`,
        formType: "Liquidation",
      }));

      setTableData(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiquidations();
  }, [fetchLiquidations]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const employeeId = localStorage.getItem("employee_id");
        const accessName = localStorage.getItem("access_name");

        const isDev = String(accessName).toLowerCase() === "developer";

        const url = isDev
          ? `/api5012/dashboard/get_requester_cards`
          : `/api5012/dashboard/get_requester_cards?employee_id=${employeeId}`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Requester cards API error:", text);
          return;
        }

        const data = await res.json();
        const requester = data[0] || {};

        const enrichedData = EMPLOYEE_STATUS_LIST.map((item) => ({
          ...item,
          value: requester[item.key] ?? 0,
        }));

        setCardsData(enrichedData);
      } catch (err) {
        console.error("Error fetching requester cards:", err);
      }
    };

    fetchCards();
  }, []);

  const selectedCount = useMemo(
    () => Object.values(selectedRows).filter(Boolean).length,
    [selectedRows]
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;

    return tableData.filter((item) =>
      [...liquidationColumns.map((col) => col.accessor), "formType"].some(
        (key) =>
          normalizeString(item[key]).includes(normalizeString(searchValue))
      )
    );
  }, [tableData, searchValue]);

  const handleRowClick = (entry) => {
    navigate("/view_liquidation_form", { state: entry });
  };

  const handleRetry = () => {
    fetchLiquidations();
  };

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "liquidated-requests",
    });
    setSelectedRows(resetSelection);
  };

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={cardsData} list={EMPLOYEE_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedCount={selectedCount}
            searchBarWidth="300px"
            onRefresh={handleRetry}
            handleExport={handleExport}
          />

          {loading && (
            <Alert variant="info" className="text-center">
              Loading data...
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="text-center">
              Error: {error}
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            </Alert>
          )}

          {!loading && !error && tableData.length === 0 && (
            <Alert variant="warning" className="text-center">
              No liquidation records found.
            </Alert>
          )}

          {!loading && !error && tableData.length > 0 && (
            <DataTable
              data={filteredData}
              height="450px"
              columns={liquidationColumns}
              onRowClick={handleRowClick}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              downloadRef={downloadRef}
              setPrintData={setPrintData}
            />
          )}

          <div className="d-none">
            <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EmpLiquidation;

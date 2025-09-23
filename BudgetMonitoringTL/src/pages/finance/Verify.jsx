import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { liquidationFinanceColumns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import LiquidationPdf from "../../components/print/LiquidationPdf";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const Verify = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  const fetchFinanceLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        "/api5012/liquidation/getapproved_liquidation?status=approved",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `liq-${index}`,
        formType: "Liquidation",
      }));

      setTableData(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // INITIAL FETCH
  useEffect(() => {
    fetchFinanceLiquidations();
  }, [fetchFinanceLiquidations]);

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

  // FILTER & SEARCH
  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;

    return tableData.filter((item) =>
      liquidationFinanceColumns.some((col) =>
        normalizeString(item[col.accessor]).includes(
          normalizeString(searchValue)
        )
      )
    );
  }, [tableData, searchValue]);

  const selectedCount = useMemo(
    () => Object.values(selectedRows).filter(Boolean).length,
    [selectedRows]
  );

  // NAVIGATION TO FINANCE FORM
  const handleRowClick = (entry) => {
    navigate("/finance_liquid_form", {
      state: { ...entry, role: "finance" },
    });
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
        <TotalCards data={cardsData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={fetchFinanceLiquidations}
            selectedCount={selectedCount}
            handleExport={handleExport}
          />

          {/* LOADING STATE */}
          {loading && (
            <Alert variant="info" className="text-center">
              Loading liquidation records...
            </Alert>
          )}

          {/* ERROR STATE */}
          {error && (
            <Alert variant="danger" className="text-center">
              Error: {error}
              <div className="mt-2">
                <Button size="sm" onClick={fetchFinanceLiquidations}>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}

          {/* TABLE IS ALWAYS RENDERED */}
          {!loading && !error && (
            <DataTable
              data={filteredData}
              height="440px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
              noDataMessage="No liquidation records found."
              showCheckbox={true}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              downloadRef={downloadRef}
              setPrintData={setPrintData}
            />
          )}
        </div>

        <div className="d-none">
          <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
        </div>
      </Container>
    </div>
  );
};

export default Verify;

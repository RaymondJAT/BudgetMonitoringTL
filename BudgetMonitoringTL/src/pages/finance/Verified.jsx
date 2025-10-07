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

const Verified = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  // Fetch VERIFIED & COMPLETED liquidations
  const fetchVerifiedAndCompleted = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const [verifiedRes, completedRes] = await Promise.all([
        fetch("/api5012/liquidation/getapproved_liquidation?status=verified", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api5012/liquidation/getapproved_liquidation?status=completed", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!verifiedRes.ok || !completedRes.ok)
        throw new Error("Failed to fetch liquidation records");

      const [verifiedData, completedData] = await Promise.all([
        verifiedRes.json(),
        completedRes.json(),
      ]);

      const apiData = [
        ...(Array.isArray(verifiedData)
          ? verifiedData
          : verifiedData.data || []),
        ...(Array.isArray(completedData)
          ? completedData
          : completedData.data || []),
      ];

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

  // Initial Fetch
  useEffect(() => {
    fetchVerifiedAndCompleted();
  }, [fetchVerifiedAndCompleted]);

  // Fetch Finance Dashboard Cards
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

  // Search + Filter
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

  // Handle row click navigation
  const handleRowClick = (entry) => {
    navigate("/finance_liquid_form", {
      state: { ...entry, role: "finance" },
    });
  };

  // Export data
  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "verified-completed-liquidations",
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
            onRefresh={fetchVerifiedAndCompleted}
            selectedCount={selectedCount}
            handleExport={handleExport}
          />

          {/* Loading */}
          {loading && (
            <Alert variant="info" className="text-center">
              Loading verified and completed liquidation records...
            </Alert>
          )}

          {/* Error */}
          {error && (
            <Alert variant="danger" className="text-center">
              Error: {error}
              <div className="mt-2">
                <Button size="sm" onClick={fetchVerifiedAndCompleted}>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}

          {/* Table */}
          {!loading && !error && (
            <DataTable
              data={filteredData}
              height="440px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
              noDataMessage="No verified or completed liquidation records found."
              showCheckbox={true}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              downloadRef={downloadRef}
              setPrintData={setPrintData}
            />
          )}

          {/* Hidden PDF export template */}
          <div className="d-none">
            <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Verified;

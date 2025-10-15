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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  /**
   * Fetch VERIFIED & COMPLETED liquidation records
   */
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

      const baseData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `liq-${index}`,
        formType: "Liquidation",
      }));

      const enrichedData = await Promise.all(
        baseData.map(async (entry) => {
          try {
            const [itemsRes, actsRes] = await Promise.all([
              fetch(
                `/api5012/liquidation_item/getliquidation_item_by_id?id=${entry.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
              fetch(
                `/api5012/liquidation_activity/getliquidation_activity_by_id?id=${entry.id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              ),
            ]);

            const items = await itemsRes.json();
            const acts = await actsRes.json();

            return {
              ...entry,
              liquidation_items: Array.isArray(items) ? items : [],
              activities: Array.isArray(acts) ? acts : [],
            };
          } catch (err) {
            console.error(`Failed to fetch details for ${entry.id}:`, err);
            return entry;
          }
        })
      );

      setTableData(enrichedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifiedAndCompleted();
  }, [fetchVerifiedAndCompleted]);

  /**
   * Fetch Finance Dashboard Cards
   */
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("/api5012/dashboard/get_finance_cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Finance cards API error:", await res.text());
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

  /**
   * Filter table data by search input
   */
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

  /**
   * Handle row click (go to Finance form view)
   */
  const handleRowClick = (entry) => {
    navigate("/finance_liquid_form", {
      state: { ...entry, role: "finance" },
    });
  };

  /**
   * Export selected or filtered data
   */
  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "verified-completed-liquidations",
    });
    setSelectedRows(resetSelection);
  };

  /**
   * Retry handler for API fetch
   */
  const handleRetry = () => fetchVerifiedAndCompleted();

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
            onRefresh={handleRetry}
            selectedCount={selectedCount}
            handleExport={handleExport}
          />

          {loading && (
            <Alert variant="info" className="text-center">
              Loading verified and completed liquidation records...
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="text-center">
              Error: {error}
              <div className="mt-2">
                <Button size="sm" onClick={handleRetry}>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}

          {!loading && !error && filteredData.length === 0 && (
            <Alert variant="warning" className="text-center">
              No verified or completed liquidation records found.
            </Alert>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <DataTable
              data={filteredData}
              height="455px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
              showCheckbox={true}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              downloadRef={downloadRef}
              setPrintData={setPrintData}
            />
          )}

          {/* Hidden PDF Renderer for Printing/Export */}
          <div className="d-none">
            <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Verified;

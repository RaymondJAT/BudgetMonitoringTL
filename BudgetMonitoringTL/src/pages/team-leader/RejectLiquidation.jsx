import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";

import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import { liquidationColumns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import LiquidationPdf from "../../components/print/LiquidationPdf";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const RejectLiquidation = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardsData, setCardsData] = useState(TEAMLEAD_STATUS_LIST);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const downloadRef = useRef(null);

  // 🔹 Fetch rejected liquidations (with details)
  const fetchRejectedLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        "/api5012/liquidation/getcash_liquidation?status=rejected",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch rejected liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      // Map base data
      const baseData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `liq-${index}`,
        formType: "Liquidation",
      }));

      // 🔹 Fetch each liquidation’s items + activities
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
    fetchRejectedLiquidations();
  }, [fetchRejectedLiquidations]);

  // 🔹 Fetch teamlead cards
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_teamleader_cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Teamleader cards API error:", await res.text());
          return;
        }

        const data = await res.json();
        const teamleader = data[0] || {};

        const enrichedData = TEAMLEAD_STATUS_LIST.map((item) => ({
          ...item,
          value: teamleader[item.key] ?? 0,
        }));

        setCardsData(enrichedData);
      } catch (err) {
        console.error("Error fetching teamleader cards:", err);
      }
    };

    fetchCards();
  }, []);

  // 🔹 Filter by search
  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;

    return tableData.filter((item) =>
      [...liquidationColumns.map((col) => col.accessor), "formType"].some(
        (key) =>
          normalizeString(item[key]).includes(normalizeString(searchValue))
      )
    );
  }, [tableData, searchValue]);

  const selectedCount = useMemo(
    () => Object.values(selectedRows).filter(Boolean).length,
    [selectedRows]
  );

  const handleRetry = () => fetchRejectedLiquidations();

  const handleRowClick = (entry) => {
    setSelectedRowId(entry.id);
    navigate("/liquid_approval_form", {
      state: { ...entry, role: "team-leader" },
    });
  };

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "rejected-liquidations",
    });
    setSelectedRows(resetSelection);
  };

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={cardsData} list={TEAMLEAD_STATUS_LIST} />
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
              Loading rejected liquidation records...
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
              No rejected liquidation records found.
            </Alert>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <DataTable
              data={filteredData}
              height="440px"
              columns={liquidationColumns}
              onRowClick={handleRowClick}
              selectedRowId={selectedRowId}
              noDataMessage="No rejected liquidation records found."
              showCheckbox={true}
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

export default RejectLiquidation;

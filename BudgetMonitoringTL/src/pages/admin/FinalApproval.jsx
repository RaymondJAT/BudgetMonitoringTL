import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { liquidationFinanceColumns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import LiquidationPdf from "../../components/print/LiquidationPdf";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const FinalApproval = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  // 🔹 Fetch verified liquidations (with full details)
  const fetchVerifiedLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Base API call
      const res = await fetch(
        "/api5012/liquidation/getapproved_liquidation?status=verified",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch verified liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      // Map base data
      const baseData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `verified-${index}`,
        formType: "Liquidation",
      }));

      // 🔹 Fetch each liquidation’s items + activities
      const enrichedData = await Promise.all(
        baseData.map(async (entry) => {
          try {
            const [itemsRes, actsRes] = await Promise.all([
              fetch(
                `/api5012/liquidation_item/getliquidation_item_by_id?id=${entry.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              ),
              fetch(
                `/api5012/liquidation_activity/getliquidation_activity_by_id?id=${entry.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
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
    fetchVerifiedLiquidations();
  }, [fetchVerifiedLiquidations]);

  // 🔹 Filter table by search input
  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;

    const lowerSearch = normalizeString(searchValue);
    return tableData.filter((item) =>
      liquidationFinanceColumns.some((col) =>
        normalizeString(item[col.accessor]).includes(lowerSearch)
      )
    );
  }, [tableData, searchValue]);

  const selectedCount = useMemo(
    () => Object.values(selectedRows).filter(Boolean).length,
    [selectedRows]
  );

  // 🔹 Navigate to admin form
  const handleRowClick = (entry) => {
    setSelectedRowId(entry.id);
    navigate("/admin_liquid_form", { state: { ...entry, role: "admin" } });
  };

  // 🔹 Export data (selected or all filtered)
  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "verified-liquidations",
    });
    setSelectedRows(resetSelection);
  };

  // 🔹 Retry handler
  const handleRetry = () => fetchVerifiedLiquidations();

  return (
    <div className="pb-3">
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3 mt-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={handleRetry}
            selectedCount={selectedCount}
            handleExport={handleExport}
            showFilter={false}
          />

          {loading && (
            <Alert variant="info" className="text-center">
              Loading verified liquidation records...
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
              No verified liquidation records found.
            </Alert>
          )}

          {!loading && !error && filteredData.length > 0 && (
            <DataTable
              data={filteredData}
              height="550px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
              noDataMessage="No verified liquidation records found."
              showCheckbox={true}
              selectedRowId={selectedRowId}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              downloadRef={downloadRef}
              setPrintData={setPrintData}
            />
          )}

          {/* Hidden PDF content for printing */}
          <div className="d-none">
            <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default FinalApproval;

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

const AdminRejectLiquidation = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  // FETCH REJECTED LIQUIDATIONS
  const fetchRejectedLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        "/api5012/liquidation/getapproved_liquidation?status=rejected",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch rejected liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `rejected-${index}`,
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
    fetchRejectedLiquidations();
  }, [fetchRejectedLiquidations]);

  // SEARCH FILTER
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

  // HANDLE ROW CLICK
  const handleRowClick = (entry) => {
    navigate("/admin_liquid_form", {
      state: { ...entry, role: "admin" },
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
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3 mt-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={(e) => setSearchValue(e.target.value)}
            onRefresh={fetchRejectedLiquidations}
            selectedCount={selectedCount}
            handleExport={handleExport}
            showFilter={false}
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
                <Button size="sm" onClick={fetchRejectedLiquidations}>
                  Try Again
                </Button>
              </div>
            </Alert>
          )}

          {!loading && !error && (
            <DataTable
              data={filteredData}
              height="550px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
              noDataMessage="No rejected liquidation records found."
              showCheckbox={true}
              selectedRowId={selectedRowId}
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

export default AdminRejectLiquidation;

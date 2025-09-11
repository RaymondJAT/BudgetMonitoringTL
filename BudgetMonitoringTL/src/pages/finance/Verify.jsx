import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert, Button } from "react-bootstrap";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { liquidationFinanceColumns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

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

  // Fetch approved/verified/completed liquidations for Finance
  const fetchFinanceLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch("/api5012/liquidation/getapproved_liquidation", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `liq-${index}`,
      }));

      setTableData(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial fetch
  useEffect(() => {
    fetchFinanceLiquidations();
  }, [fetchFinanceLiquidations]);

  // compute totals for dashboard cards
  const totalComputationData = useMemo(() => tableData, [tableData]);

  // filter + search
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

  // navigation to Finance form
  const handleRowClick = (entry) => {
    navigate("/finance_liquid_form", {
      state: { ...entry, role: "finance" },
    });
  };

  return (
    <div className="pb-3">
      {/* Finance dashboard cards */}
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={fetchFinanceLiquidations}
          />

          {/* Loading state */}
          {loading && (
            <Alert variant="info" className="text-center">
              Loading liquidation records...
            </Alert>
          )}

          {/* Error state */}
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

          {/* No records */}
          {!loading && !error && filteredData.length === 0 && (
            <Alert variant="warning" className="text-center">
              No liquidation records found.
            </Alert>
          )}

          {/* Data table */}
          {!loading && !error && filteredData.length > 0 && (
            <DataTable
              data={filteredData}
              height="455px"
              columns={liquidationFinanceColumns}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Verify;

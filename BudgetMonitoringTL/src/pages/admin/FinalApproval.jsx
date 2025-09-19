import { useState, useMemo, useEffect, useCallback } from "react";
import { Container, Alert, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { liquidationFinanceColumns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

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

  // FETCH VERIFIED LIQUIDATIONS (for admin final approval)
  const fetchVerifiedLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await fetch(
        "/api5012/liquidation/getapproved_liquidation?status=verified",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch verified liquidations");

      const result = await res.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `verified-${index}`,
      }));

      setTableData(mappedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerifiedLiquidations();
  }, [fetchVerifiedLiquidations]);

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

  // HANDLE ROW CLICK → Navigate to AdminLiquidForm
  const handleRowClick = (entry) => {
    navigate("/admin_liquid_form", {
      state: { ...entry, role: "admin" },
    });
  };

  return (
    <div className="pb-3">
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3 mt-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={(e) => setSearchValue(e.target.value)}
            onRefresh={fetchVerifiedLiquidations}
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
                <Button size="sm" onClick={fetchVerifiedLiquidations}>
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
              noDataMessage="No verified liquidation records found."
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default FinalApproval;

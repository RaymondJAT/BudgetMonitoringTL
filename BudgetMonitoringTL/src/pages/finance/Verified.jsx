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

const Verified = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVerifiedLiquidations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // ✅ Fetch only VERIFIED liquidations
      const res = await fetch(
        "/api5012/liquidation/getapproved_liquidation?status=verified",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  // INITIAL FETCH
  useEffect(() => {
    fetchVerifiedLiquidations();
  }, [fetchVerifiedLiquidations]);

  const totalComputationData = useMemo(() => tableData, [tableData]);

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

  // NAVIGATION TO FINANCE FORM
  const handleRowClick = (entry) => {
    navigate("/finance_liquid_form", {
      state: { ...entry, role: "finance" },
    });
  };

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={fetchVerifiedLiquidations}
          />

          {/* LOADING STATE */}
          {loading && (
            <Alert variant="info" className="text-center">
              Loading verified liquidation records...
            </Alert>
          )}

          {/* ERROR STATE */}
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

          {/* TABLE IS ALWAYS RENDERED */}
          {!loading && !error && (
            <DataTable
              data={filteredData}
              height="455px"
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

export default Verified;

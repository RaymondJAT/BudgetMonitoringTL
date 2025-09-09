import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import { STATUS } from "../../constants/status";
import { liquidationColumns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const Liquidation = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiquidations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await fetch("/api5012/liquidation/getcash_liquidation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch liquidations");

      const result = await response.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || `${index}-${Date.now()}`,
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

  const totalComputationData = useMemo(() => tableData, [tableData]);

  const filteredData = useMemo(() => {
    const base = tableData.filter(
      (item) =>
        item.status !== STATUS.APPROVED && item.status !== STATUS.REJECTED
    );

    if (!searchValue) return base;

    return base.filter((item) =>
      [...columns.map((col) => col.accessor), "formType"].some((key) =>
        normalizeString(item[key]).includes(normalizeString(searchValue))
      )
    );
  }, [tableData, searchValue]);

  const handleRetry = () => {
    fetchLiquidations();
  };

  const handleRowClick = (entry) => {
    navigate("/liquid_approval_form", { state: entry });
  };

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={TEAMLEAD_STATUS_LIST} />
      </div>

      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onRefresh={handleRetry}
          />

          {/* Loading state */}
          {loading && (
            <Alert variant="info" className="text-center">
              Loading data...
            </Alert>
          )}

          {/* Error state */}
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

          {/* Empty state */}
          {!loading && !error && filteredData.length === 0 && (
            <Alert variant="warning" className="text-center">
              No pending liquidation records found.
            </Alert>
          )}

          {/* Data table */}
          {!loading && !error && filteredData.length > 0 && (
            <DataTable
              data={filteredData}
              height="455px"
              columns={liquidationColumns}
              onRowClick={handleRowClick}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default Liquidation;

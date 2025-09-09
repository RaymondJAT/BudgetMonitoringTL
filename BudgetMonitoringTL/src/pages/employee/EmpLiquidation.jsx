import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";
import { liquidationColumns } from "../../handlers/tableHeader";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";

const normalizeString = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

const EmpLiquidation = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLiquidations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const employeeName = localStorage.getItem("employee_name");
      const accessName = localStorage.getItem("access_name");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api5012/liquidation/getcash_liquidation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch liquidations");

      const result = await response.json();

      const apiData = Array.isArray(result) ? result : result.data || [];

      if (apiData.length === 0) {
        setTableData([]);
        setLoading(false);
        return;
      }

      const visibleData =
        String(accessName) === "Administrator"
          ? apiData
          : apiData.filter(
              (item) => String(item.employee) === String(employeeName)
            );

      const mappedData = visibleData.map((item, index) => ({
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

  const selectedCount = useMemo(
    () => Object.values(selectedRows).filter(Boolean).length,
    [selectedRows]
  );

  const totalComputationData = useMemo(() => tableData, [tableData]);

  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;

    return tableData.filter((item) =>
      [...liquidationColumns.map((col) => col.accessor), "formType"].some(
        (key) =>
          normalizeString(item[key]).includes(normalizeString(searchValue))
      )
    );
  }, [tableData, searchValue, liquidationColumns]);

  const handleRowClick = (entry) => {
    navigate("/view_liquidation_form", { state: entry });
  };

  const handleRetry = () => {
    fetchLiquidations();
  };

  return (
    <div className="pb-3">
      {/* Summary cards */}
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={EMPLOYEE_STATUS_LIST} />
      </div>

      {/* DataTable */}
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            selectedCount={selectedCount}
            searchBarWidth="300px"
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
          {!loading && !error && tableData.length === 0 && (
            <Alert variant="warning" className="text-center">
              No liquidation records found.
            </Alert>
          )}

          {/* Data table */}
          {!loading && !error && tableData.length > 0 && (
            <DataTable
              data={filteredData}
              height="350px"
              columns={liquidationColumns}
              onRowClick={handleRowClick}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          )}
        </div>
      </Container>
    </div>
  );
};

export default EmpLiquidation;

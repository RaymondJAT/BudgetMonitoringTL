import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [cardsData, setCardsData] = useState([TEAMLEAD_STATUS_LIST]);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const downloadRef = useRef(null);

  const fetchRejectedLiquidations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      // Fetch only rejected liquidations
      const response = await fetch(
        "/api5012/liquidation/getcash_liquidation?status=rejected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok)
        throw new Error("Failed to fetch rejected liquidations");

      const result = await response.json();
      const apiData = Array.isArray(result) ? result : result.data || [];

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item.id || item._id || index,
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

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_teamleader_cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Teamleader cards API error:", text);
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
      state: {
        ...entry,
        role: "team-leader",
      },
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
                <button
                  className="btn btn-sm btn-primary"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            </Alert>
          )}

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
        </div>

        <div className="d-none">
          <LiquidationPdf contentRef={downloadRef} data={printData || {}} />
        </div>
      </Container>
    </div>
  );
};

export default RejectLiquidation;

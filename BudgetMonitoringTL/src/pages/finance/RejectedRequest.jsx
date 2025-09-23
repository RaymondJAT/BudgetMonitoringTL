import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";
import { formatPrintData } from "../../utils/formatPrintData";
import { handleExportData } from "../../utils/exportItems";
import { numberToWords } from "../../utils/numberToWords";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";

import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";
import ExpenseReport from "../../components/print/ExpenseReport";
import TotalCards from "../../components/TotalCards";

const RejectedRequest = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [particulars, setParticulars] = useState([]);
  const [printData, setPrintData] = useState(null);
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  // Fetch rejected finance requests
  const fetchRejectedData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "/api5012/cash_request/getapproved_cash_request?status=rejected",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch rejected requests");

      const result = await res.json();
      const mappedData = (result || [])
        .map((item, index) => ({
          ...item,
          id: item.id ?? `${index}`,
          formType: "Cash Request",
        }))
        .filter((item) => item.status.toLowerCase() === "rejected"); // safety filter

      setTableData(mappedData);
    } catch (err) {
      console.error("Error fetching rejected requests:", err);
    }
  }, []);

  useEffect(() => {
    fetchRejectedData();
  }, [fetchRejectedData]);

  // TOTAL CARDS
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_finance_cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Finance cards API error:", text);
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

  // keep particulars in sync
  useEffect(() => {
    const items = formatPrintData(tableData);
    const isSame = JSON.stringify(particulars) === JSON.stringify(items);
    if (!isSame) setParticulars(items);
  }, [tableData]);

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/finance_approval_form", { state: entry });
    }
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fieldsToSearch = [...columns.map((col) => col.accessor), "formType"];
    return fieldsToSearch.some((key) =>
      normalize(item[key]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () => tableData.filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  const amountInWords = useMemo(() => {
    if (!printData) return "";
    let total = 0;

    if (printData?.items?.length > 0) {
      total = printData.items.reduce(
        (sum, item) => sum + (parseFloat(item.subtotal) || 0),
        0
      );
    } else {
      total = parseFloat(printData?.amount || 0);
    }

    return numberToWords(total);
  }, [printData]);

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "RejectedRequests",
    });
    setSelectedRows(resetSelection);
  };

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
            leftContent={
              selectedCount === 1 && <PrintButton onClick={handlePrint} />
            }
            handleExport={handleExport}
            selectedCount={selectedCount}
          />

          <DataTable
            data={filteredData}
            height="440px"
            columns={columns}
            onRowClick={handleRowClick}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            downloadRef={downloadRef}
            setPrintData={setPrintData}
          />

          {/* hidden print/download */}
          <div className="d-none">
            <ExpenseReport
              contentRef={contentRef}
              data={{
                ...printData,
                total: printData?.total ?? 0,
                items: printData?.items || [],
              }}
              amountInWords={amountInWords}
            />

            <ExpenseReport
              contentRef={downloadRef}
              data={{
                ...printData,
                total: printData?.total ?? 0,
                items: printData?.items || [],
              }}
              amountInWords={amountInWords}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default RejectedRequest;

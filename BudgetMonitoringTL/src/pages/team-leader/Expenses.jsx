import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";
import { formatPrintData } from "../../utils/formatPrintData";
import { handleExportData } from "../../utils/exportItems";
import { numberToWords } from "../../utils/numberToWords";
import { STATUS } from "../../constants/status";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";

import DataTable from "../../components/layout/DataTable";
import ToolBar from "../../components/layout/ToolBar";
import ExpenseReport from "../../components/print/ExpenseReport";
import TotalCards from "../../components/TotalCards";

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [particulars, setParticulars] = useState([]);
  const [printData, setPrintData] = useState(null);

  const [cardsData, setCardsData] = useState([TEAMLEAD_STATUS_LIST]);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  //  Fetch team leader expenses
  const fetchExpenses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "/api5012/cash_request/getcash_request?status=pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch expenses");

      const result = await res.json();
      console.log("expenses", result);

      const mappedData = (result || []).map((item, index) => ({
        ...item,
        id: item.id ?? `${index}`,
        formType: "Cash Request",
      }));

      setTableData(mappedData);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  }, []);

  // fetch on mount
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

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

  // keep particulars in sync
  useEffect(() => {
    const items = formatPrintData(tableData);
    const isSame = JSON.stringify(particulars) === JSON.stringify(items);
    if (!isSame) setParticulars(items);
  }, [tableData]);

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/cash_approval_form", { state: entry });
    } else if (entry.formType === "Liquidation") {
      navigate("/liquid_approval_form", { state: entry });
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

  const filteredData = useMemo(
    () =>
      tableData
        .filter((item) => item.status === STATUS.PENDING)
        .filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );


  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "cash-requests",
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
            handleExport={handleExport}
            selectedCount={selectedCount}
          />

          <DataTable
            data={filteredData}
            height="450px"
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

export default Expenses;

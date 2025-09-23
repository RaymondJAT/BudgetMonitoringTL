import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { columns } from "../../handlers/tableHeader";
import { handleExportData } from "../../utils/exportItems";
import { numberToWords } from "../../utils/numberToWords";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import ExpenseReport from "../../components/print/ExpenseReport";

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);

  const [cardsData, setCardsData] = useState([TEAMLEAD_STATUS_LIST]);

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  // FETCH APPROVED & COMPLETED REQUESTS
  const fetchApprovedAndCompleted = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api5012/cash_request/getcash_request?status=approved`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok)
        throw new Error("Failed to fetch approved/completed requests");

      const result = await res.json();
      const mappedData = (result || []).map((item, index) => ({
        ...item,
        id: item.id ?? `${index}`,
        formType: "Cash Request",
      }));

      // APPROVED & COMPLETED REQUESTS ONLY
      setTableData(
        mappedData.filter((item) =>
          ["approved", "completed"].includes(item.status.toLowerCase())
        )
      );
    } catch (err) {
      console.error("Error fetching approved/completed requests:", err);
    }
  }, []);

  useEffect(() => {
    fetchApprovedAndCompleted();
  }, [fetchApprovedAndCompleted]);

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
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();
    return tableData.filter((item) =>
      columns.some((col) =>
        normalize(item[col.accessor]).includes(normalize(searchValue))
      )
    );
  }, [tableData, searchValue]);

  const handleRowClick = (entry) => {
    navigate("/cash_approval_form", { state: entry });
  };

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "Approved_Completed",
    });
    setSelectedRows(resetSelection);
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
            height="455px"
            columns={columns}
            onRowClick={handleRowClick}
            onDelete={(entry) =>
              setTableData((prev) =>
                prev.filter((item) => item.id !== entry.id)
              )
            }
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            downloadRef={downloadRef}
            setPrintData={setPrintData}
          />

          <div style={{ display: "none" }}>
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

export default Approval;

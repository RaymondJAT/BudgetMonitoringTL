import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus, FaEye } from "react-icons/fa";
import { LuFolderCheck } from "react-icons/lu";
import { TbReportAnalytics } from "react-icons/tb";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingFundColumns as baseColumns } from "../../constants/BudgetingColumn";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";
import NewRevolvingFund from "../../components/ui/modal/admin/NewRevolvingFund";
import AppButton from "../../components/ui/buttons/AppButton";
import ViewRevolvingFund from "../../components/ui/modal/admin/ViewRevolvingFund";
import SubmitRevolvingFund from "../../components/ui/modal/admin/SubmitRevolvingFund";

const RevolvingFund = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundData, setFundData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);

  const [viewBudgetId, setViewBudgetId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);

  const token = localStorage.getItem("token");

  const fetchFundData = async () => {
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api5001/revolving_fund/getrevolving_fund", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch revolving fund data");

      const result = await res.json();
      const fundArray = result.data || [];
      const sortedFunds = [...fundArray].sort((a, b) => b.id - a.id);
      setFundData(sortedFunds);
    } catch (error) {
      console.error("Fetch error:", error);
      setFundData([]);
    } finally {
      setLoading(false);
    }
  };

  // FETCH DATE RANGE
  const fetchFundDataByDate = async (startDate, endDate, status = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formatDate = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        console.warn("Invalid date passed to formatDate:", date);
        return "";
      }
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      const start = startDate ? formatDate(startDate) : "";
      let end = endDate ? formatDate(endDate) : "";

      if (endDate) {
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setHours(23, 59, 59, 999);
        end = formatDate(adjustedEnd);
      }

      let url = `/api5001/revolving_fund/getrevolving-fund-target`;
      if (start) url += `/${start}`;
      if (end) url += `/${end}`;
      if (status) url += `/${status}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const result = await res.json();
      console.log("API Response:", result);

      setFundData(result.data || []);
    } catch (error) {
      console.error("Error fetching by date range:", error);
      setFundData([]);
    }
  };

  useEffect(() => {
    fetchFundData();
  }, []);

  const handleAddFundItem = () => {
    fetchFundData();
  };

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

  // Inject buttons into the "Actions" column
  const columns = baseColumns.map((col) => {
    if (col.accessor === "actions") {
      return {
        ...col,
        Cell: ({ row }) => {
          const rowData = row.original || row;
          return (
            <div className="d-flex gap-1">
              <AppButton
                label={<FaEye />}
                variant="outline-dark"
                className="custom-app-button"
                onClick={() => {
                  setViewBudgetId(rowData.id);
                  setShowViewModal(true);
                }}
              />
              <AppButton
                label={<LuFolderCheck />}
                variant="outline-success"
                className="custom-app-button"
                onClick={() => {
                  setSelectedFund(rowData);
                  setShowSubmitModal(true);
                }}
              />

              <AppButton
                label={<TbReportAnalytics />}
                variant="outline-dark"
                className="custom-app-button"
              />
            </div>
          );
        },
      };
    }
    return col;
  });

  return (
    <>
      <div className="mt-3">
        <TotalCards data={cardsData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-3">
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            leftContent={
              <AppButton
                label={
                  <>
                    <FaPlus />
                    <span className="d-none d-sm-inline ms-1">
                      Revolving Fund
                    </span>
                  </>
                }
                variant="outline-dark"
                size="sm"
                onClick={() => setShowModal(true)}
                className="custom-app-button"
              />
            }
            onDateRangeChange={(start, end) => fetchFundDataByDate(start, end)}
          />

          <NewRevolvingFund
            show={showModal}
            onHide={() => setShowModal(false)}
            onAdd={handleAddFundItem}
          />

          {loading ? (
            <p className="text-muted">Loading revolving fund data...</p>
          ) : (
            <DataTable
              data={fundData}
              columns={columns}
              height="325px"
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              showActions={false}
              showCheckbox={false}
            />
          )}
        </div>
      </Container>

      {/* ViewRevolvingFund */}
      {showViewModal && (
        <ViewRevolvingFund
          show={showViewModal}
          onHide={() => setShowViewModal(false)}
          budgetId={viewBudgetId}
          tableData={fundData}
        />
      )}

      {showSubmitModal && (
        <SubmitRevolvingFund
          show={showSubmitModal}
          onHide={() => setShowSubmitModal(false)}
          fundData={selectedFund}
          onSuccess={fetchFundData}
        />
      )}
    </>
  );
};

export default RevolvingFund;

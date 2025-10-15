import { useEffect, useState, useMemo } from "react";
import { Container } from "react-bootstrap";
import { FaPlus, FaEye, FaEdit } from "react-icons/fa";
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
import EditAddedRevolvingFund from "../../components/ui/modal/admin/EditAddedRevolvingFund";

const RevolvingFund = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedFund, setSelectedFund] = useState(null);
  const [viewBudgetId, setViewBudgetId] = useState(null);

  const [fundData, setFundData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);

  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);

  const token = localStorage.getItem("token");

  // FETCH REVOLVING FUND
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

  useEffect(() => {
    fetchFundData();
  }, []);

  const handleAddFundItem = () => {
    fetchFundData();
  };

  // FETCH BY DATE RANGE
  const fetchFundDataByDate = async (startDate, endDate, status = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formatDate = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(d.getDate()).padStart(2, "0")}`;
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
      setFundData(result.data || []);
    } catch (error) {
      console.error("Error fetching by date range:", error);
      setFundData([]);
    }
  };

  // SUBMIT HANDLER
  const handleFundSubmit = async () => {
    await fetchFundData();
  };

  // FETCH CARDS
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

  // FORMATTER
  const pesoFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // COLUMN SETUP
  const columns = baseColumns.map((col) => {
    if (col.accessor === "actions") {
      return {
        ...col,
        Cell: ({ row }) => {
          const rowData = row.original || row;
          return (
            <div className="d-flex gap-1 justify-content-center">
              {/* VIEW BUTTON */}
              <AppButton
                label={<FaEye />}
                variant="outline-dark"
                className="custom-app-button"
                onClick={() => {
                  setViewBudgetId(rowData.id);
                  setShowViewModal(true);
                }}
              />

              {/* SUBMIT BUTTON */}
              <AppButton
                label={<LuFolderCheck />}
                variant="outline-success"
                className="custom-app-button"
                onClick={() => {
                  setSelectedFund(rowData);
                  setShowSubmitModal(true);
                }}
              />

              {/* REPORT BUTTON */}
              {/* <AppButton
                label={<TbReportAnalytics />}
                variant="outline-dark"
                className="custom-app-button"
              /> */}

              {/* EDIT BUTTON */}
              <AppButton
                label={<FaEdit />}
                variant="outline-dark"
                className="custom-app-button"
                onClick={() => {
                  console.log("📝 Edit button clicked. Row data:", rowData);
                  setSelectedFund(rowData);
                  setShowEditModal(true);
                }}
              />
            </div>
          );
        },
      };
    }

    // BEGINNING AND ADDED
    if (col.accessor === "beginning_amount") {
      return {
        ...col,
        Header: "Beginning / Added Amount",
        Cell: ({ row }) => {
          const rowData = row.original || row;
          return (
            <div className="d-flex flex-column align-items-center text-center">
              <span style={{ fontSize: "0.8rem" }}>
                <strong>Beginning:</strong>{" "}
                {pesoFormatter.format(rowData.beginning_amount || 0)}
              </span>
              <span style={{ fontSize: "0.8rem" }}>
                <strong>Added:</strong>{" "}
                {pesoFormatter.format(rowData.added_amount || 0)}
              </span>
            </div>
          );
        },
      };
    }

    return col;
  });

  // SEARCH FILTER
  const filteredData = useMemo(() => {
    if (!searchValue) return fundData;
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();

    return fundData.filter((item) =>
      [...columns.map((col) => col.accessor)].some((key) =>
        normalize(item[key]).includes(normalize(searchValue))
      )
    );
  }, [fundData, searchValue, columns]);

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
              data={filteredData}
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
          onSuccess={handleFundSubmit}
        />
      )}

      {showEditModal && (
        <EditAddedRevolvingFund
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          fundData={selectedFund}
          onSuccess={fetchFundData}
        />
      )}
    </>
  );
};

export default RevolvingFund;

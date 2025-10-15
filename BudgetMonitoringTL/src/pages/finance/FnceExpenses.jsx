import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingHistory } from "../../constants/historyColumn";
import { columns, liquidationFinanceColumns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import OutstandingBalanceChart from "../../components/ui/charts/OutstandingBalanceChart";
import CashRequestPieChart from "../../components/ui/charts/CashRequestPieChart";
import LiquidationPieChart from "../../components/ui/charts/LiquidationPieChart";
import CashFlowChart from "../../components/ui/charts/CashFlowChart";
import DataTable from "../../components/layout/DataTable";

const FnceExpenses = () => {
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);
  // const [outstandingBalance, setOutstandingBalance] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);
  // const [cashFlow, setCashFlow] = useState([]);

  const [revolvingFundData, setRevolvingFundData] = useState([]);
  const [loadingRevolving, setLoadingRevolving] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);

  const [pendingLiquidations, setPendingLiquidations] = useState([]);
  const [loadingLiquidations, setLoadingLiquidations] = useState(false);

  const navigate = useNavigate();

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

  // FETCH CHARTS
  useEffect(() => {
    const fetchFinanceCharts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_finance_charts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Finance charts API error:", text);
          return;
        }

        const data = await res.json();

        // setOutstandingBalance(
        //   (data.outstanding_balance || []).map((item) => ({
        //     date: new Date(item.date).toLocaleDateString("en-US", {
        //       month: "short",
        //       day: "numeric",
        //     }),
        //     outstanding_balance: parseFloat(item.outstanding_balance) || 0,
        //     released_amount: parseFloat(item.released_amount) || 0,
        //   }))
        // );

        setRequestStatus(data.request_status?.[0] || {});

        // setCashFlow(
        //   (data.cash_flow || []).map((item) => ({
        //     date: new Date(item.date).toLocaleDateString("en-US", {
        //       month: "short",
        //       day: "numeric",
        //     }),
        //     total_cash_request: parseFloat(item.total_cash_request) || 0,
        //     total_liquidation: parseFloat(item.total_liquidation) || 0,
        //   }))
        // );
      } catch (err) {
        console.error("Error fetching finance charts:", err);
      }
    };

    fetchFinanceCharts();
  }, []);

  // FETCH REVOLVING FUND
  useEffect(() => {
    const fetchRevolving = async () => {
      try {
        setLoadingRevolving(true);
        const res = await fetch(
          "/api5001/revolving_fund_activity/getrevolving_fund_activity"
        );
        const json = await res.json();
        setRevolvingFundData(json?.data || []);
      } catch (err) {
        console.error("Error fetching revolving fund:", err);
      } finally {
        setLoadingRevolving(false);
      }
    };

    fetchRevolving();
  }, []);

  // FETCH PENDING REQUESTS
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoadingPending(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          "/api5012/cash_request/getapproved_cash_request?status=approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch pending requests");
        const result = await res.json();

        const mappedData = (result || [])
          .map((item, index) => ({
            ...item,
            id: item.id ?? `${index}`,
            formType: "Cash Request",
          }))
          .filter((item) => item.status === "approved");

        setPendingRequests(mappedData);
      } catch (err) {
        console.error("Error fetching pending requests:", err);
      } finally {
        setLoadingPending(false);
      }
    };

    fetchPending();
  }, []);

  //FETCH PENDING LIQUIDATIONS
  useEffect(() => {
    const fetchPendingLiquidations = async () => {
      try {
        setLoadingLiquidations(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          "/api5012/liquidation/getapproved_liquidation?status=approved",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch pending liquidations");
        const result = await res.json();

        const apiData = Array.isArray(result) ? result : result.data || [];
        const mappedData = apiData.map((item, index) => ({
          ...item,
          id: item.id || item._id || `liq-${index}`,
          formType: "Liquidation",
        }));

        setPendingLiquidations(mappedData);
      } catch (err) {
        console.error("Error fetching pending liquidations:", err);
      } finally {
        setLoadingLiquidations(false);
      }
    };

    fetchPendingLiquidations();
  }, []);

  // HANDLE ROW CLICKS
  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/finance_approval_form", { state: entry });
    }
    if (entry.formType === "Liquidation") {
      navigate("/finance_liquid_form", {
        state: { ...entry, role: "finance" },
      });
    }
  };

  return (
    <>
      <div className="mt-3">
        <TotalCards data={cardsData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-1">
        {/* Charts */}
        <div className="row g-2 mb-2">
          {/* Top row: Cash Flow Chart full width */}
          <div className="col-12">
            <div className="custom-container rounded p-3">
              <CashFlowChart />
            </div>
          </div>

          {/* Bottom row: Pie Chart (left) + Outstanding Balance (right) */}

          <div className="col-12 col-lg-6">
            <div className="custom-container rounded p-3 h-100">
              <p className="fw-bold mb-2 text-center">Liquidation</p>
              <LiquidationPieChart data={requestStatus} />
            </div>
          </div>
          <div className="col-12 col-lg-6">
            <div className="custom-container rounded p-3 h-100">
              <p className="fw-bold mb-2 text-center">Cash Requests</p>
              <CashRequestPieChart data={requestStatus} />
            </div>
          </div>

          <div className="col-12">
            <div className="custom-container rounded p-3">
              <OutstandingBalanceChart />
            </div>
          </div>
        </div>

        {/* Pending Cash Requests */}
        <div className="row g-2 mb-2">
          <div className="col-12">
            <div className="custom-container rounded p-3 h-100">
              <p className="fw-bold mb-2">Pending Cash Requests</p>
              <DataTable
                data={pendingRequests}
                columns={columns}
                height="180px"
                showActions={false}
                showCheckbox={false}
                onRowClick={handleRowClick}
              />
              {loadingPending && (
                <div className="text-center mt-2">Loading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Liquidations */}
        <div className="row g-2 mb-2">
          <div className="col-12">
            <div className="custom-container rounded p-3 h-100">
              <p className="fw-bold mb-2">Pending Liquidations</p>
              <DataTable
                data={pendingLiquidations}
                columns={liquidationFinanceColumns}
                height="180px"
                showActions={false}
                showCheckbox={false}
                onRowClick={handleRowClick}
              />
              {loadingLiquidations && (
                <div className="text-center mt-2">Loading...</div>
              )}
            </div>
          </div>
        </div>

        {/* Revolving Fund History */}
        <div className="row g-2 mb-3">
          <div className="col-12">
            <div className="custom-container rounded p-3 h-100">
              <p className="fw-bold mb-2">Revolving Fund Activity</p>
              <DataTable
                data={revolvingFundData}
                columns={revolvingHistory}
                height="180px"
                showActions={false}
                showCheckbox={false}
              />
              {loadingRevolving && (
                <div className="text-center mt-2">Loading...</div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FnceExpenses;

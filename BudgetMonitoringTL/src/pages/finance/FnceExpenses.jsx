import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { latestListingsData } from "../../constants/latestListingsData";

import TotalCards from "../../components/TotalCards";
import OutstandingBalanceChart from "../../components/ui/charts/finance/OutstandingBalanceChart";
import LiquidationPieChart from "../../components/ui/charts/finance/LiquidationPieChart";
import LatestListingsTable from "../../components/LatestListingsTable";

const FnceExpenses = () => {
  const [cardsData, setCardsData] = useState(FINANCE_STATUS_LIST);
  const [outstandingBalance, setOutstandingBalance] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);

  // Fetch TotalCards data
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_finance_cards", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Finance cards API error:", text);
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
        console.error("❌ Error fetching finance cards:", err);
      }
    };

    fetchCards();
  }, []);

  // Fetch charts data
  useEffect(() => {
    const fetchFinanceCharts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api5012/dashboard/get_finance_charts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Finance charts API error:", text);
          return;
        }

        const data = await res.json();

        // Format outstanding_balance for chart
        const formattedOutstanding = (data.outstanding_balance || []).map(
          (item) => ({
            date: new Date(item.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            balance: parseFloat(item.outstanding_balance) || 0,
          })
        );

        setOutstandingBalance(formattedOutstanding);

        // Set request_status for PieChart
        setRequestStatus(data.request_status?.[0] || {});
      } catch (err) {
        console.error("❌ Error fetching finance charts:", err);
      }
    };

    fetchFinanceCharts();
  }, []);

  return (
    <>
      <div className="mt-3">
        <TotalCards data={cardsData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-1">
        <div className="row g-3 mb-3">
          {/* Pie chart for request_status */}
          <div className="col-12 col-lg-4">
            {" "}
            <div className="custom-container rounded p-3 h-100">
              {" "}
              <LiquidationPieChart data={requestStatus} />{" "}
            </div>{" "}
          </div>

          {/* Line chart for outstanding_balance */}
          <div className="col-12 col-lg-8">
            <div className="custom-container rounded p-3 h-100">
              <OutstandingBalanceChart data={outstandingBalance} />
            </div>
          </div>
        </div>

        <LatestListingsTable
          data={latestListingsData}
          title="🕒 Latest Listings"
          height="220px"
        />
      </Container>
    </>
  );
};

export default FnceExpenses;

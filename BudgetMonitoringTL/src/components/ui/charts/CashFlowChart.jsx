import { useState, useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CashFlowChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportDate, setReportDate] = useState("");

  useEffect(() => {
    const fetchCashFlow = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api5001/dashboard/revolving-fund-totals");
        if (!res.ok) throw new Error("Failed to fetch cash flow data");
        const json = await res.json();

        const formatted = (json?.data || []).map((item) => ({
          fund_name: item.fund_name,
          total_cash_request: parseFloat(item.total_cash_request) || 0,
          total_liquidation: parseFloat(item.total_liquidation) || 0,
          total_fund: parseFloat(item.total_fund) || 0,
          date: item.date
            ? new Date(item.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          month: item.month,
          year: item.year,
        }));

        setData(formatted);

        // ✅ Show reporting period if available
        if (formatted.length > 0 && formatted[0].month && formatted[0].year) {
          const monthName = new Date(0, formatted[0].month - 1).toLocaleString(
            "default",
            { month: "long" }
          );
          setReportDate(`${monthName} ${formatted[0].year}`);
        }
      } catch (err) {
        console.error("Error fetching cash flow data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCashFlow();
  }, []);

  if (loading) {
    return (
      <Container
        fluid
        className="h-100 d-flex align-items-center justify-content-center"
      >
        <Spinner animation="border" size="sm" className="me-2" />
        <p className="text-muted mb-0">Loading Cash Flow...</p>
      </Container>
    );
  }

  if (!data.length) {
    return (
      <Container
        fluid
        className="h-100 d-flex align-items-center justify-content-center"
      >
        <p className="text-muted">No Cash Flow Data</p>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100">
      <div
        className="w-100 h-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100%", padding: "1rem 0" }}
      >
        <div className="text-center mb-3">
          <p className="fw-bold mb-0">Cash Flow Overview</p>
          {reportDate && (
            <small className="text-muted">Reporting Period: {reportDate}</small>
          )}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fund_name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tickFormatter={(value) =>
                `₱${value.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              }
            />
            <Tooltip
              formatter={(value) =>
                `₱${Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              }
              labelFormatter={(label, payload) => {
                const date = payload?.[0]?.payload?.date;
                return `${label}${date ? ` (${date})` : ""}`;
              }}
            />
            <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            <Line
              type="monotone"
              dataKey="total_fund"
              stroke="#1c6b1eff"
              strokeWidth={2}
              name="Total Fund"
            />
            <Bar
              dataKey="total_cash_request"
              fill="#2464c9"
              name="Cash Request"
              barSize={20}
            />
            <Bar
              dataKey="total_liquidation"
              fill="#f2950a"
              name="Liquidation"
              barSize={20}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default CashFlowChart;

import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const OutstandingBalanceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api5001/dashboard/revolving-fund-summary");
        if (!res.ok) throw new Error("Failed to fetch revolving fund summary");
        const json = await res.json();

        const formatted = (json?.data?.data || []).map((item) => ({
          date: new Date(item.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          fund_name: item.fund_name,
          total_issued: parseFloat(item.total_issued) || 0,
          total_liquidated: parseFloat(item.total_liquidated) || 0,
          total_unliquidated: parseFloat(item.total_unliquidated) || 0,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching revolving fund summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return (
      <Container
        fluid
        className="h-100 d-flex align-items-center justify-content-center"
      >
        <Spinner animation="border" size="sm" className="me-2" />
        <p className="text-muted mb-0">Loading Outstanding Balance...</p>
      </Container>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Container
        fluid
        className="h-100 d-flex align-items-center justify-content-center"
      >
        <p className="text-muted">No Outstanding Balance Data</p>
      </Container>
    );
  }

  return (
    <Container fluid className="h-100">
      <div
        className="w-100 h-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100%", padding: "1rem 0" }}
      >
        <p className="mb-3 fw-bold text-center">Revolving Fund Summary</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
          >
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
                return `${label} (${date})`;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={5}
              wrapperStyle={{ fontSize: "0.7rem" }}
            />

            <Line
              type="monotone"
              dataKey="total_issued"
              stroke="#6736da"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Total Issued"
            />
            <Line
              type="monotone"
              dataKey="total_liquidated"
              stroke="#1c6b1e"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Total Liquidated"
            />
            <Line
              type="monotone"
              dataKey="total_unliquidated"
              stroke="#f2950a"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name="Total Unliquidated"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default OutstandingBalanceChart;

import { Container } from "react-bootstrap";
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

const OutstandingBalanceChart = ({ data }) => {
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

  // ✅ Normalize API data (convert strings → numbers)
  const formattedData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    outstanding_balance: parseFloat(item.outstanding_balance) || 0,
    released_amount: parseFloat(item.released_amount) || 0,
  }));

  return (
    <Container fluid className="h-100">
      <div
        className="w-100 h-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100%", padding: "1rem 0" }}
      >
        <p className="mb-3 fw-bold text-center">Outstanding Balance</p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
            />
            <Legend
              verticalAlign="bottom"
              height={5}
              wrapperStyle={{ fontSize: "0.7rem" }}
            />
            <Line
              type="monotone"
              dataKey="outstanding_balance"
              stroke="#d97706"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Outstanding Balance"
            />
            <Line
              type="monotone"
              dataKey="released_amount"
              stroke="#0d6efd"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Released Amount"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default OutstandingBalanceChart;

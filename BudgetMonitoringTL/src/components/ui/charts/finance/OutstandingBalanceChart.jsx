import { Container } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  return (
    <Container fluid className="h-100">
      <div
        className="w-100 h-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100%", padding: "1rem 0" }}
      >
        <p className="mb-3 fw-bold text-center">📉 Outstanding Balance</p>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#0243c7"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Outstanding Balance"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default OutstandingBalanceChart;

import { Container } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CashFlowChart = ({ data }) => {
  if (!data || data.length === 0) {
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
        <p className="mb-3 fw-bold text-center">Cash Flow</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₱${Number(value).toLocaleString()}`}
            />
            <Legend wrapperStyle={{ fontSize: "0.7rem" }} />
            {/* Side-by-side bars */}
            <Bar
              dataKey="total_cash_request"
              fill="#4e79a7"
              name="Cash Request"
            />
            <Bar
              dataKey="total_liquidation"
              fill="#f28e2b"
              name="Liquidation"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default CashFlowChart;

import { Container } from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const MonthlyCashChart = ({ data }) => {
  return (
    <Container fluid className="h-100">
      <div
        className="w-100 h-100 d-flex flex-column justify-content-center"
        style={{ minHeight: "100%", padding: "1rem 0" }}
      >
        <p className="mb-3 fw-bold text-center">💰 Monthly Cash Released</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
            <Legend />
            <Bar
              dataKey="cashReleased"
              fill="#0243c7ff"
              name="Cash Released"
              barSize={40}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
};

export default MonthlyCashChart;

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
    <Container fluid>
      <div className="w-100">
        <p className="mb-3 fw-bold">💰 Monthly Cash Released</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
            <Legend />
            <Bar
              dataKey="cashReleased"
              fill="#0d6efd"
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

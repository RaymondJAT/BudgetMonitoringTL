import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BudgetUsageChart = ({ data }) => {
  return (
    <div className="custom-container rounded p-3 w-100">
      <p className="mb-3 fw-bold">📊 Budget Usage Over Time</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="allocated"
            stroke="#008000"
            strokeDasharray="5 5"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Allocated"
          />
          <Line
            type="monotone"
            dataKey="used"
            stroke="#0d6efd"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Used"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetUsageChart;

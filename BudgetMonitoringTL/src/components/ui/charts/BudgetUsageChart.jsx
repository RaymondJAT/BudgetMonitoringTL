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
    <div className="request-container p-3">
      <h6 className="mb-3">📊 Budget Usage Over Time</h6>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
          <Legend />

          {/* Allocated Line */}
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

          {/* Used Line */}
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

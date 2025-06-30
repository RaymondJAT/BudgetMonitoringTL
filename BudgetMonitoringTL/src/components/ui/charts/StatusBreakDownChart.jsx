import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  Approved: "#198754",
  Pending: "#ffc107",
  Rejected: "#dc3545",
  Reimbursed: "#0d6efd",
  Returned: "#6f42c1",
};

const StatusBreakDownChart = ({ data }) => {
  return (
    <div className="request-container p-3">
      <h6 className="mb-3">📈 Status Breakdown</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || "#999"}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} requests`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusBreakDownChart;

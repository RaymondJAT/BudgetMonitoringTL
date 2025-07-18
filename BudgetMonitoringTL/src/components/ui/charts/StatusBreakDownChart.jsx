import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../ChartCard";

const STATUS_COLORS = {
  Approved: "#198754",
  Pending: "#ffc107",
  Rejected: "#dc3545",
  Reimbursed: "#0d6efd",
  Returned: "#6f42c1",
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      fontSize={10}
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatusBreakDownChart = ({ data }) => {
  return (
    <ChartCard title="📈 Status Breakdown" style={{ fontSize: "0.75rem" }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="status"
            innerRadius={35}
            outerRadius={65}
            paddingAngle={3}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || "#999"}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} request${value > 1 ? "s" : ""}`}
            contentStyle={{ fontSize: "0.75rem" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "0.75rem" }}
            formatter={(value) => (
              <span style={{ marginLeft: "6px" }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default StatusBreakDownChart;

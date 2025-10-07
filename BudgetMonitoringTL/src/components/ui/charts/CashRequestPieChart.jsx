import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

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

const CashRequestPieChart = ({ data }) => {
  if (!data) return null;

  const COLORS = {
    pending_requests: "#f2950a",
    approved_requests: "#1c6b1eff",
    completed_requests: "#2464c9",
    rejected_requests: "#dd2525",
  };

  // ONLY REQUEST KEYS
  const processedData = Object.entries(data)
    .filter(([key]) => key.includes("requests"))
    .map(([key, value]) => ({
      name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value,
      color: COLORS[key] || "#888888",
    }));

  const total = processedData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={processedData}
          dataKey="value"
          nameKey="name"
          outerRadius="95%"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {processedData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => {
            const percent = total ? ((value / total) * 100).toFixed(1) : 0;
            return [`${value} request(s) (${percent}%)`, name];
          }}
          contentStyle={{ fontSize: "0.75rem" }}
        />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: "0.70rem", paddingLeft: 10 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CashRequestPieChart;

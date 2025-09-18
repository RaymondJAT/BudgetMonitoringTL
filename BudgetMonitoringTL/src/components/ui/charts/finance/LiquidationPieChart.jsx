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

const LiquidationPieChart = ({ data }) => {
  if (!data) return null;

  const COLORS = {
    rejected_requests: "#c10e20",
    rejected_liquidations: "#800000",
    pending_requests: "#ff9f00",
    pending_liquidations: "#f0c808",
    approved_requests: "#014f28",
    verified_liquidations: "#205bd1",
    approved_liquidations: "#20ced1",
  };

  const processedData = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
    color: COLORS[key] || "#000000ff",
  }));

  // CALCULATE PERCENTAGE IN TOOLTIP
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

export default LiquidationPieChart;

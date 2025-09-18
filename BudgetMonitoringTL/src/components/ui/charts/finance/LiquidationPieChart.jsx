import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import ChartCard from "../../../ChartCard";

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
    rejected_requests: "#c10e20", // Red
    rejected_liquidations: "#800000", // Maroon
    pending_requests: "#ff9f00", // Orange
    pending_liquidations: "#f0c808", // Yellow
    approved_requests: "#014f28", // Green
    verified_liquidations: "#205bd1", // Blue
    approved_liquidations: "#20ced1", // Cyan
  };

  const processedData = Object.entries(data).map(([key, value]) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value,
    color: COLORS[key] || "#000000ff", 
  }));

  return (
    <ChartCard title="🧾 Request Status" style={{ fontSize: "0.75rem" }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={processedData}
            dataKey="value"
            nameKey="name"
            outerRadius="90%"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {processedData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} request(s)`}
            contentStyle={{ fontSize: "0.75rem" }}
          />
          {/* <Legend wrapperStyle={{ fontSize: "0.5rem" }} /> */}
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default LiquidationPieChart;

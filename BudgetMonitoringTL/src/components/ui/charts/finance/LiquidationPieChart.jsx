import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../../ChartCard";

// const COLORS = [
//   "#c10e20ff", // Red
//   "#0243c7ff", // Blue
//   "#ff9f1cff", // Orange
//   "#014f28ff", // Green
//   "#ff6b6bff", // Pink
//   "#6b5b95ff", // Purple
//   "#f0c808ff", // Yellow
// ];

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

  const COLORS = [
    "#c10e20ff",
    "#0243c7ff",
    "#ff9f00ff",
    "#014f28ff",
    "#800080ff",
    "#00ced1ff",
    "#ff1493ff",
  ];

  const processedData = Object.entries(data).map(([key, value], index) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: value,
    color: COLORS[index % COLORS.length],
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

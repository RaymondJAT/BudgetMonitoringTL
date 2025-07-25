import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../../ChartCard";

const COLORS = ["#c10e20ff", "#014f28ff"]; // Red and Green
const RADIAN = Math.PI / 180;

// Same as DepartmentBudgetChart
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

const LiquidationPieChart = ({ data }) => {
  const processedData = [
    {
      name: "Unreturned Funds",
      value: data.filter((item) => !item.reimbursementDate).length,
    },
    {
      name: "Reimbursed",
      value: data.filter((item) => item.reimbursementDate).length,
    },
  ];

  return (
    <ChartCard
      title="🧾 Liquidation vs Reimbursement"
      style={{ fontSize: "0.75rem" }}
    >
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
            {processedData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} item(s)`}
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

export default LiquidationPieChart;

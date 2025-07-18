import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../ChartCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#DC3545", "#6F42C1"];
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

const DepartmentBudgetChart = ({ data }) => {
  return (
    <ChartCard
      title="🏢 Budget Distribution by Department"
      style={{ fontSize: "0.75rem" }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="used"
            nameKey="department"
            outerRadius="90%"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₱${value.toLocaleString()}`}
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

export default DepartmentBudgetChart;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "../../../ChartCard";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
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

const BudgetCharts = ({ transactions }) => {
  // Monthly Spending
  const monthlyTrendMap = {};
  transactions.forEach(({ amount, month }) => {
    monthlyTrendMap[month] = (monthlyTrendMap[month] || 0) + amount;
  });
  const monthlyTrendData = Object.entries(monthlyTrendMap).map(
    ([month, amount]) => ({ month, amount })
  );

  // Spending by Type
  const typeMap = {
    "Cash Request": 0,
    Liquidation: 0,
    Reimbursement: 0,
  };
  transactions.forEach(({ type, amount }) => {
    typeMap[type] = (typeMap[type] || 0) + amount;
  });
  const spendingByTypeData = Object.entries(typeMap).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <>
      <div className="row g-3">
        {/* Line Chart */}
        <div className="col-md-7 mb-2">
          <ChartCard
            title="📈 Monthly Spending Trend"
            style={{ fontSize: "0.75rem" }}
          >
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#800000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pie Chart */}
        <div className="col-md-5 mb-2">
          <ChartCard
            title="🥧 Spending by Type"
            style={{ fontSize: "0.75rem" }}
          >
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={spendingByTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius="90%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {spendingByTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: "0.75rem" }} />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </>
  );
};

export default BudgetCharts;

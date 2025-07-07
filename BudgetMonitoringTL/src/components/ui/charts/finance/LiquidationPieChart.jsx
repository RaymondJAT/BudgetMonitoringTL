import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#dc3545", "#198754"];

const LiquidationPieChart = ({ data, height = 160 }) => {
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
    <div className="w-100 h-100">
      <p className="fw-bold mb-3">🧾 Liquidation vs Reimbursement</p>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            outerRadius={40}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} item(s)`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiquidationPieChart;

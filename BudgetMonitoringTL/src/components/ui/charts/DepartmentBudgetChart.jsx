import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0d6efd", "#20c997", "#ffc107", "#dc3545", "#6f42c1"];

const DepartmentBudgetChart = ({ data }) => {
  return (
    <div className="request-container p-3">
      <h6 className="mb-3">🏢 Budget Distribution by Department</h6>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="used"
            nameKey="department"
            cx="50%"
            cy="50%"
            outerRadius={70}
            fill="#8884d8"
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `₱${value.toLocaleString()}`}
            contentStyle={{ fontSize: "0.75rem" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBudgetChart;

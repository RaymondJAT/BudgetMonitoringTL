import { Container } from "react-bootstrap";
import LiquidationPieChart from "./ui/charts/finance/LiquidationPieChart";
import MonthlyCashChart from "./ui/charts/finance/MonthlyCashChart";

const FinanceCharts = ({ pieData, barData }) => {
  return (
    <Container fluid className="mb-3">
      <div className="custom-container rounded p-3 d-flex gap-3">
        {/* Pie Chart - 40% */}
        <div style={{ flex: "0 0 30%" }}>
          <LiquidationPieChart data={pieData} />
        </div>

        {/* Bar Chart - 60% */}
        <div style={{ flex: "1 1 70%" }}>
          <MonthlyCashChart data={barData} />
        </div>
      </div>
    </Container>
  );
};

export default FinanceCharts;

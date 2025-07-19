import { Row, Col } from "react-bootstrap";
import BudgetUsageChart from "./ui/charts/BudgetUsageChart";
import DepartmentBudgetChart from "./ui/charts/DepartmentBudgetChart";
import StatusBreakDownChart from "./ui/charts/StatusBreakDownChart";
import { budgetUsageData } from "../constants/budgetUsageData";
import { departmentBudgetData } from "../constants/departmentBudgetData";
import { statusBreakdownData } from "../constants/statusBreakdownData";

const BudgetDashboardCharts = () => {
  return (
    <div className=" w-100">
      {/* Top Line Chart */}
      <div className="mb-3">
        <BudgetUsageChart data={budgetUsageData} />
      </div>

      {/* Bottom Row: Pie + Donut Side by Side */}
      <Row className="g-3 align-items-stretch" style={{ height: "100%" }}>
        <Col md={6} className="d-flex">
          <div className="flex-fill">
            <DepartmentBudgetChart data={departmentBudgetData} />
          </div>
        </Col>
        <Col md={6} className="d-flex">
          <div className="flex-fill">
            <StatusBreakDownChart data={statusBreakdownData} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default BudgetDashboardCharts;

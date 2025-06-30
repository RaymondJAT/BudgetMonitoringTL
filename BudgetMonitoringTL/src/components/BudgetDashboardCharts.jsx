import { Container, Row, Col } from "react-bootstrap";
import BudgetUsageChart from "./ui/charts/BudgetUsageChart";
import DepartmentBudgetChart from "./ui/charts/DepartmentBudgetChart";
import StatusBreakDownChart from "./ui/charts/StatusBreakDownChart";

import { budgetUsageData } from "../constants/budgetUsageData";
import { departmentBudgetData } from "../constants/departmentBudgetData";
import { statusBreakdownData } from "../constants/statusBreakdownData";

const BudgetDashboardCharts = () => {
  return (
    <Container fluid className="pb-3">
      <Row>
        <Col xs={12}>
          <BudgetUsageChart data={budgetUsageData} />
        </Col>
      </Row>

      <Row className="mt-1 g-3">
        <Col md={6} xs={12}>
          <DepartmentBudgetChart data={departmentBudgetData} />
        </Col>
        <Col md={6} xs={12}>
          <StatusBreakDownChart data={statusBreakdownData} />
        </Col>
      </Row>
    </Container>
  );
};

export default BudgetDashboardCharts;

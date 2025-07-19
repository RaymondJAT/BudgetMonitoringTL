import { Container, Row, Col } from "react-bootstrap";

import { BudgetOverview } from "../../constants/totalList";
import { mockBudgets } from "../../constants/mockBudgets";
import { overdueListings } from "../../constants/overdueListings";

import TotalCards from "../../components/TotalCards";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";
import LatestListings from "../../components/LatestListings";
import OverdueListings from "../../components/OverdueListings";

const AdmExpenses = () => {
  const flattenedData = mockBudgets.flatMap((budget) =>
    budget.transactions.map((tx) => ({
      ...tx,
      department: budget.department,
    }))
  );

  return (
    <div className="mt-3">
      <TotalCards list={BudgetOverview} type="admin" />

      <Container fluid>
        <Row className="d-flex align-items-stretch g-3">
          <Col lg={6} className="d-flex">
            <div className="flex-fill">
              <BudgetDashboardCharts />
            </div>
          </Col>
          <Col lg={6} className="d-flex">
            <div className="flex-fill">
              <OverdueListings
                data={overdueListings}
                height="430px"
                title="⚠️ Overdue Liquidations"
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Row>
        <Col className="d-flex">
          <LatestListings
            data={flattenedData}
            title="🕒 Latest Listings"
            height="200px"
          />
        </Col>
      </Row>
    </div>
  );
};

export default AdmExpenses;

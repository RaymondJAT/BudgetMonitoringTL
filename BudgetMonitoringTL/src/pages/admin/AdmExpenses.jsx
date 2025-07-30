import { Container, Row, Col } from "react-bootstrap";

import { BudgetOverview } from "../../constants/totalList";
import { mockBudgets } from "../../constants/mockBudgets";
import { overdueListings } from "../../constants/overdueListings";

import TotalCards from "../../components/TotalCards";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";
import LatestListingsTable from "../../components/LatestListingsTable";
import OverdueListingsTable from "../../components/OverdueListingsTable";

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
              <OverdueListingsTable
                data={overdueListings}
                height="478px"
                title="⚠️ Overdue Liquidations"
              />
            </div>
          </Col>
        </Row>

        <LatestListingsTable
          data={flattenedData}
          title="🕒 Latest Listings"
          height="200px"
        />
      </Container>
    </div>
  );
};

export default AdmExpenses;

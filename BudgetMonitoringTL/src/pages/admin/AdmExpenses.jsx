import { Container, Row, Col } from "react-bootstrap";

import { BudgetOverview } from "../../constants/totalList";
import { latestListingsData } from "../../constants/latestListingsData";
import { overdueListings } from "../../constants/overdueListings";

import TotalCards from "../../components/TotalCards";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";
import LatestListings from "../../components/LatestListings";
import OverdueListings from "../../components/OverdueListings";

const AdmExpenses = () => {
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
              <LatestListings
                data={latestListingsData}
                title="🕒 Latest Listings"
              />
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="d-flex">
            <OverdueListings
              data={overdueListings}
              title="⚠️ Overdue Liquidations"
              height="213px"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdmExpenses;

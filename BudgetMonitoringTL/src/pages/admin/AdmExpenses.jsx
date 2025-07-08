import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { BudgetOverview } from "../../constants/totalList";
import { latestListingsData } from "../../constants/latestListingsData";

import TotalCards from "../../components/TotalCards";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";
import LatestListings from "../../components/LatestListings";

const AdmExpenses = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="mt-3">
      <TotalCards list={BudgetOverview} type="admin" />
      <Container fluid>
        <Row className="d-flex align-items-stretch">
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
      </Container>
    </div>
  );
};

export default AdmExpenses;

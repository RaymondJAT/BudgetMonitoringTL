import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ToolBar from "../../components/layout/ToolBar";
import TotalCards from "../../components/TotalCards";
import { BudgetOverview } from "../../constants/totalList";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";
import LatestListings from "../../components/LatestListings";
import { latestListingsData } from "../../constants/latestListingsData";

const AdmExpenses = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="mt-3">
      <TotalCards list={BudgetOverview} type="admin" />
      {/* Optional search bar */}
      {/* <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} /> */}
      <Container fluid>
        <Row className="d-flex align-items-stretch">
          <Col lg={6} className="d-flex">
            <div className="flex-fill">
              <BudgetDashboardCharts />
            </div>
          </Col>
          <Col lg={6} className="d-flex">
            <div className="flex-fill">
              <LatestListings data={latestListingsData} />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdmExpenses;

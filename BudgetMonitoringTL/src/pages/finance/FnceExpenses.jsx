import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { latestListingsData } from "../../constants/latestListingsData";
import { monthlyUsageData } from "../../constants/budgetUsageData";
import { mockLiquidations } from "../../constants/mockLiquidation";

import TotalCards from "../../components/TotalCards";
import MonthlyCashChart from "../../components/ui/charts/finance/MonthlyCashChart";
import LiquidationPieChart from "../../components/ui/charts/finance/LiquidationPieChart";
import LatestListingsTable from "../../components/LatestListingsTable";

const FnceExpenses = () => {
  const [tableData] = useState([]);
  const [liquidationData] = useState(mockLiquidations);

  const totalComputationData = useMemo(() => {
    return [...tableData];
  }, [tableData]);

  return (
    <>
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-1">
        <div className="row g-3 mb-3">
          <div className="col-12 col-lg-4">
            <div className="custom-container rounded p-3 h-100">
              <LiquidationPieChart data={liquidationData} />
            </div>
          </div>
          <div className="col-12 col-lg-8">
            <div className="custom-container rounded p-3 h-100">
              <MonthlyCashChart data={monthlyUsageData} />
            </div>
          </div>
        </div>

        <LatestListingsTable
          data={latestListingsData}
          title="🕒 Latest Listings"
          height="220px"
        />
      </Container>
    </>
  );
};

export default FnceExpenses;

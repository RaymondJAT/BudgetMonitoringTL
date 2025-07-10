import { useState, useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";
import { LOCAL_KEYS } from "../../constants/localKeys";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { latestListingsData } from "../../constants/latestListingsData";
import { monthlyUsageData } from "../../constants/budgetUsageData";
import { mockLiquidations } from "../../constants/mockLiquidation";

import TotalCards from "../../components/TotalCards";
import MonthlyCashChart from "../../components/ui/charts/finance/MonthlyCashChart";
import LiquidationPieChart from "../../components/ui/charts/finance/LiquidationPieChart";
import LatestListings from "../../components/LatestListings";

const FnceExpenses = () => {
  const [tableData, setTableData] = useState([]);
  const [liquidationData, setLiquidationData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];
    setLiquidationData(data);
  }, []);

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  return (
    <div>
      <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />

      <Container fluid className="pb-1">
        <div className="d-flex gap-3 mb-3">
          {/* Pie Chart Box */}
          <div
            className="custom-container rounded p-3"
            style={{ flex: "0 0 30%" }}
          >
            <LiquidationPieChart data={mockLiquidations} />
          </div>

          {/* Bar Chart Box */}
          <div
            className="custom-container rounded p-3"
            style={{ flex: "1 1 70%" }}
          >
            <MonthlyCashChart data={monthlyUsageData} />
          </div>
        </div>

        <LatestListings
          data={latestListingsData}
          title="📋 Recent Transactions List"
          height="220px"
        />
      </Container>
    </div>
  );
};

export default FnceExpenses;

import { useMemo, useState, useEffect } from "react";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { monthlyUsageData } from "../../constants/budgetUsageData";
import { mockLiquidations } from "../../constants/mockLiquidation";
import TotalCards from "../../components/TotalCards";
import MonthlyCashChart from "../../components/ui/charts/finance/MonthlyCashChart";
import LiquidationPieChart from "../../components/ui/charts/finance/LiquidationPieChart";
import { Container } from "react-bootstrap";

const FnceExpenses = () => {
  const [tableData, setTableData] = useState([]);
  const [liquidationData, setLiquidationData] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];
    setLiquidationData(data);
  }, []);

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  return (
    <div>
      <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />

      <Container fluid>
        <div className="d-flex gap-3 my-3">
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
      </Container>
    </div>
  );
};

export default FnceExpenses;

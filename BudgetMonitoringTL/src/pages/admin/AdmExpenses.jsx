import { useState } from "react";
import ToolBar from "../../components/layout/ToolBar";
import TotalCards from "../../components/TotalCards";
import { BudgetOverview } from "../../constants/totalList";
import BudgetDashboardCharts from "../../components/BudgetDashboardCharts";

const AdmExpenses = () => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <TotalCards list={BudgetOverview} />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <BudgetDashboardCharts />
    </>
  );
};

export default AdmExpenses;

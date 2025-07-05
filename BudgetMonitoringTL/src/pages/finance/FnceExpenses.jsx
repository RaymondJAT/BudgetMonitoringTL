import { useMemo, useState } from "react";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { monthlyUsageData } from "../../constants/budgetUsageData";
import TotalCards from "../../components/TotalCards";
import MonthlyCashChart from "../../components/ui/charts/finance/MonthlyCashChart";

const FnceExpenses = () => {
  const [tableData, setTableData] = useState([]);

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
      <MonthlyCashChart data={monthlyUsageData} />
    </div>
  );
};

export default FnceExpenses;

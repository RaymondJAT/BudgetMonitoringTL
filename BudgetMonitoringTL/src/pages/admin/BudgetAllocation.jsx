import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";

import { mockBudgets } from "../../constants/mockBudgets";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { BudgetAllocationOverview } from "../../constants/totalList";

import ToolBar from "../../components/layout/ToolBar";
import BudgetTable from "../../components/layout/BudgetTable";
import TotalCards from "../../components/TotalCards";

const BudgetAllocation = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);

  const archiveData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ARCHIVE)) || [];
  }, []);

  const importantData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_IMPORTANT)) || [];
  }, []);

  const totalComputationData = useMemo(
    () => [...tableData, ...archiveData, ...importantData],
    [tableData, archiveData, importantData]
  );

  return (
    <>
      <TotalCards data={totalComputationData} list={BudgetAllocationOverview} />
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
          <BudgetTable data={mockBudgets} height="275px" />
        </div>
      </Container>
    </>
  );
};

export default BudgetAllocation;

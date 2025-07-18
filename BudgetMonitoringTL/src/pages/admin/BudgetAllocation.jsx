import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";

import { mockBudgets } from "../../constants/mockBudgets";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { BudgetOverview } from "../../constants/totalList";

import ToolBar from "../../components/layout/ToolBar";
import BudgetTable from "../../components/layout/BudgetTable";
import TotalCards from "../../components/TotalCards";
import NewBudgetAllocation from "../../components/ui/modal/admin/NewBudgetAllocation";
import AppButton from "../../components/ui/AppButton";

const BudgetAllocation = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState(mockBudgets);
  const [showModal, setShowModal] = useState(false);

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
      <TotalCards data={totalComputationData} list={BudgetOverview} />
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            showFilter={false}
            leftContent={
              <AppButton
                label="+ Add Allocation"
                variant="outline-dark"
                size="sm"
                onClick={() => setShowModal(true)}
                className="custom-app-button"
              />
            }
          />
          <NewBudgetAllocation
            show={showModal}
            onHide={() => setShowModal(false)}
          />
          <BudgetTable
            data={tableData}
            height="335px"
            onUpdate={(updated) => setTableData(updated)}
          />
        </div>
      </Container>
    </>
  );
};

export default BudgetAllocation;

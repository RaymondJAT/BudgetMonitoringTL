import { useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { mockBudgets } from "../../constants/mockBudgets";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";

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

  const handleAddBudgetItem = (newItem) => {
    setTableData((prev) => [...prev, newItem]);
  };

  return (
    <>
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-3">
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            showFilter={false}
            leftContent={
              <AppButton
                label={
                  <>
                    <FaPlus />
                    <span className="d-none d-sm-inline ms-1">Allocation</span>
                  </>
                }
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
            onSubmit={handleAddBudgetItem}
          />

          <BudgetTable
            data={tableData}
            height="325px"
            onUpdate={(updated) => setTableData(updated)}
          />
        </div>
      </Container>
    </>
  );
};

export default BudgetAllocation;

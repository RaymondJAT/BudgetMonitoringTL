import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";

import ToolBar from "../../components/layout/ToolBar";
import BudgetTable from "../../components/layout/BudgetTable";
import TotalCards from "../../components/TotalCards";
import NewBudgetAllocation from "../../components/ui/modal/admin/NewBudgetAllocation";
import AppButton from "../../components/ui/AppButton";

const BudgetAllocation = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [budgetData, setBudgetData] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA ON FIRST LOAD
  const fetchBudgetData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/budget/getbudget", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Server responded with:", res.status);
        throw new Error("Failed to fetch budget data");
      }

      const result = await res.json();
      const budgetArray = result.data || [];
      setBudgetData(budgetArray);
    } catch (error) {
      console.error("Fetch error:", error);
      setBudgetData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const archiveData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ARCHIVE)) || [];
  }, []);

  const importantData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_IMPORTANT)) || [];
  }, []);

  const totalComputationData = useMemo(
    () => [...archiveData, ...importantData],
    [archiveData, importantData]
  );

  const handleAddBudgetItem = (newItem) => {
    setBudgetData((prev) => [newItem, ...prev]);
  };

  const handleUpdateBudget = (updatedTable) => {
    setBudgetData(updatedTable);
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
            onAdd={handleAddBudgetItem}
          />

          {loading ? (
            <p className="text-muted">Loading budget data...</p>
          ) : (
            <BudgetTable
              data={budgetData}
              height="325px"
              onUpdate={handleUpdateBudget}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default BudgetAllocation;

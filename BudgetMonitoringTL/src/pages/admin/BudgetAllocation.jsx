import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

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

  const fetchBudgetData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api5001/budget/getbudget_allocation", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Server responded with: ${res.status}`);

      const result = await res.json();
      setBudgetData(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setBudgetData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetDataByDate = async (startDate, endDate, status = "") => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const formDate = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    try {
      const start = startDate ? formDate(startDate) : "";
      let end = endDate ? formDate(endDate) : "";

      if (endDate) {
        const adjustedEnd = new Date(endDate);
        adjustedEnd.setHours(23, 59, 59, 999);
        end = formDate(adjustedEnd);
      }

      let url = `/api5001/budget/getbudget_allocation`;
      if (start) url += `/${start}`;
      if (end) url += `/${end}`;
      if (status) url += `/${status}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const result = await res.json();
      setBudgetData(result.data || []);
    } catch (error) {
      console.error("Error fetching by date range:", error);
      setBudgetData([]);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const totalComputationData = useMemo(() => {
    return budgetData;
  }, [budgetData]);

  const handleAddBudgetItem = (newItem) => {
    setBudgetData((prev) => [newItem, ...prev]);
  };

  const handleUpdateBudget = (updatedTable) => {
    setBudgetData(updatedTable);
  };

  const filteredData = useMemo(() => {
    if (!searchValue) return budgetData;
    return budgetData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [budgetData, searchValue]);

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
            onDateRangeChange={(start, end) =>
              fetchBudgetDataByDate(start, end)
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
              data={filteredData}
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

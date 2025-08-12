import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingFundColumns } from "../../constants/BudgetingColumn";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";
import NewRevolvingFund from "../../components/ui/modal/admin/NewRevolvingFund";
import AppButton from "../../components/ui/AppButton";

const RevolvingFund = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [fundData, setFundData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [loading, setLoading] = useState(true);

  // FETCH DATA ON FIRST LOAD
  const fetchFundData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/revolving_fund/getrevolving_fund", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Server responded with:", res.status);
        throw new Error("Failed to fetch revolving fund data");
      }

      const result = await res.json();
      const fundArray = result.data || [];

      const sortedFunds = [...fundArray].sort((a, b) => b.id - a.id);

      setFundData(sortedFunds);
    } catch (error) {
      console.error("Fetch error:", error);
      setFundData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFundData();
  }, []);

  // Add new item instantly at top
  const handleAddFundItem = () => {
    fetchFundData(); // reload data from API
  };

  return (
    <>
      <div className="mt-3">
        <TotalCards data={fundData} list={FINANCE_STATUS_LIST} />
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
                    <span className="d-none d-sm-inline ms-1">
                      Revolving Fund
                    </span>
                  </>
                }
                variant="outline-dark"
                size="sm"
                onClick={() => setShowModal(true)}
                className="custom-app-button"
              />
            }
          />

          <NewRevolvingFund
            show={showModal}
            onHide={() => setShowModal(false)}
            onAdd={handleAddFundItem}
          />

          {loading ? (
            <p className="text-muted">Loading revolving fund data...</p>
          ) : (
            <DataTable
              data={fundData}
              columns={revolvingFundColumns}
              height="325px"
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              showActions={false}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default RevolvingFund;

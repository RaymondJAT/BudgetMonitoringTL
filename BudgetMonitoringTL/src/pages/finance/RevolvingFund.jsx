import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingFundColumns } from "../../constants/BudgetingColumn";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";
import NewRevolvingFund from "../../components/ui/modal/admin/NewRevolvingFund";
import AppButton from "../../components/ui/AppButton";

const RevolvingFund = () => {
  const [revolvingData, setRevolvingData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch revolving funds
  const fetchRevolvingFund = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch("/api/revolving_fund/getrevolving_fund", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch data");

      const result = await res.json();
      setRevolvingData(result.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setRevolvingData([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new fund
  const handleAddFund = (newFund) => {
    if (!newFund) return;
    setRevolvingData((prev) => [newFund, ...prev]);
    setSearchValue(""); // Reset search to show new item
  };

  // Filter data based on search
  const filteredData = useMemo(() => {
    const searchTerm = searchValue.toLowerCase();
    return revolvingData.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      )
    );
  }, [revolvingData, searchValue]);

  // Get totals for cards
  const totalComputationData = useMemo(() => {
    const archive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const important =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_IMPORTANT)) || [];
    return [...archive, ...important];
  }, []);

  useEffect(() => {
    fetchRevolvingFund();
  }, []);

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
                    <span className="d-none d-sm-inline ms-1">
                      Revolving Fund
                    </span>
                  </>
                }
                size="sm"
                variant="outline-dark"
                onClick={() => setShowModal(true)}
                className="custom-app-button"
              />
            }
          />

          <NewRevolvingFund
            show={showModal}
            onHide={() => setShowModal(false)}
            onAdd={handleAddFund}
          />

          {loading ? (
            <p className="text-muted">Loading data...</p>
          ) : (
            <DataTable
              data={filteredData}
              columns={revolvingFundColumns}
              height="350px"
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default RevolvingFund;

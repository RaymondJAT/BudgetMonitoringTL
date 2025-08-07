import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingFundColumns } from "../../constants/BudgetingColumn";

import { handleExportData } from "../../utils/exportItems";

import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import TotalCards from "../../components/TotalCards";
import NewRevolvingFund from "../../components/ui/modal/admin/NewRevolvingFund";
import AppButton from "../../components/ui/AppButton";

const RevolvingFund = () => {
  const [revolvingData, setRevolvingData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  const [searchValue, setSearchValue] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  /** FETCH API */
  const fetchRevolvingFund = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/revolving_fund/getrevolving_fund", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const result = await response.json();
      const data = Array.isArray(result?.data) ? result.data : [];
      setRevolvingData(data);
    } catch (error) {
      console.error("Error fetching revolving fund data:", error);
      setRevolvingData([]);
    } finally {
      setLoading(false);
    }
  };

  // NORMALIZE TEXT FOR SEARCH
  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fields = [
      ...revolvingFundColumns.map((col) => col.accessor),
      "formType",
    ];
    return fields.some((key) =>
      normalize(item?.[key]).includes(normalize(value))
    );
  };

  const handleNewFundCreated = (newFund) => {
    if (!newFund) return;
    setRevolvingData((prev) => [newFund, ...prev]);
    setSearchValue("");
  };

  const handleExport = () => {
    const reset = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "RevolvingFund",
    });
    setSelectedRows(reset);
  };

  const leftContent = (
    <AppButton
      label={
        <>
          <FaPlus />
          <span className="d-none d-sm-inline ms-1">Revolving Fund</span>
        </>
      }
      size="sm"
      variant="outline-dark"
      onClick={() => setShowModal(true)}
      className="custom-app-button"
    />
  );

  const totalComputationData = useMemo(() => {
    const archive =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const important =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_IMPORTANT)) || [];
    return [...archive, ...important];
  }, []);

  /** FILTER AND SORT BASED ON SEARCH*/
  const filteredData = useMemo(() => {
    return revolvingData.filter((item) => isMatch(item, searchValue));
  }, [revolvingData, searchValue]);

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
            leftContent={leftContent}
            handleExport={handleExport}
            searchBarWidth="300px"
          />

          <NewRevolvingFund
            show={showModal}
            onHide={() => setShowModal(false)}
            onCreated={handleNewFundCreated}
          />

          {loading ? (
            <p className="text-muted">Loading revolving fund data...</p>
          ) : (
            <DataTable
              data={filteredData}
              columns={revolvingFundColumns}
              height="350px"
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              showCheckbox={false}
              showActions={false}
            />
          )}
        </div>
      </Container>
    </>
  );
};

export default RevolvingFund;

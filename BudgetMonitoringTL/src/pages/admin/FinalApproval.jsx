import { useState, useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { BudgetOverview } from "../../constants/totalList";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const FinalApproval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ACTIVE)) || [];
    setTableData(stored);
    setFilteredData(stored);
  }, []);

  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (col) => col.accessor !== "price" && col.accessor !== "quantity"
      ),
    []
  );

  const handleSearch = (val) => {
    setSearchValue(val);
    const filtered = tableData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(val.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ARCHIVE)) || [];
    const activeData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ADM_ACTIVE)) || [];
    return [...archiveData, ...activeData];
  }, []);

  return (
    <>
      <div className="pb-3">
        <div className="mt-3">
          <TotalCards data={totalComputationData} list={BudgetOverview} />
        </div>
        <Container fluid>
          <div className="custom-container shadow-sm rounded p-3">
            <ToolBar
              searchValue={searchValue}
              onSearchChange={(e) => handleSearch(e.target.value)}
            />

            <DataTable
              columns={filteredColumns}
              height="355px"
              data={filteredData}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default FinalApproval;

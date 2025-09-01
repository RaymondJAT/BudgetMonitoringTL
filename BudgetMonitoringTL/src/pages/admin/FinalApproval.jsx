import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { BudgetOverview } from "../../constants/totalList";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const FinalApproval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);

  const filteredColumns = useMemo(
    () =>
      columns.filter(
        (col) => col.accessor !== "price" && col.accessor !== "quantity"
      ),
    []
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return tableData;
    return tableData.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [tableData, searchValue]);

  const handleSearch = (val) => {
    setSearchValue(val);
  };

  const totalComputationData = useMemo(() => {
    return tableData;
  }, [tableData]);

  return (
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
            height="350px"
            data={filteredData}
          />
        </div>
      </Container>
    </div>
  );
};

export default FinalApproval;

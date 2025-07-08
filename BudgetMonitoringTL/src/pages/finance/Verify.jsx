import { useState, useMemo } from "react";
import { LOCAL_KEYS } from "../../constants/localKeys";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { expenseHeaders } from "../../handlers/columnHeaders";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const Verify = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  const filteredData = useMemo(
    () => tableData.filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  return (
    <div>
      <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <DataTable data={filteredData} height="390px" columns={expenseHeaders} />
    </div>
  );
};

export default Verify;

import { useState, useMemo } from "react";
import { LOCAL_KEYS } from "../../constants/localKeys";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";

const Processing = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  return (
    <div>
      <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
    </div>
  );
};

export default Processing;

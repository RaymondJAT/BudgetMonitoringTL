import { useMemo, useState } from "react";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { EMPLOYEE_STATUS_LIST } from "../../constants/employeeStatusList";
import ToolBar from "../../components/layout/ToolBar";
import Total from "../../components/layout/Total";

const MyExpenses = () => {
  const [tableData, setTableData] = useState([]);

  const archiveData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
  }, []);

  const importantData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
  }, []);

  const totalComputationData = useMemo(
    () => [...tableData, ...archiveData, ...importantData],
    [tableData, archiveData, importantData]
  );

  return (
    <div>
      <Total data={totalComputationData} statusList={EMPLOYEE_STATUS_LIST} />
      <ToolBar />
    </div>
  );
};

export default MyExpenses;

import { useMemo, useState } from "react";
import ToolBar from "../../components/layout/ToolBar";
import Total from "../../components/layout/Total";

const LOCAL_KEYS = {
  ACTIVE: "expensesData",
  TRASH: "trashData",
  ARCHIVE: "archiveData",
  IMPORTANT: "importantData",
};

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
      <Total data={totalComputationData} />
      <ToolBar />
    </div>
  );
};

export default MyExpenses;

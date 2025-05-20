import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import { columns } from "../mock-data/tableHeader";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";
const LOCAL_KEY_ARCHIVE = "archiveData";

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  // load from localstorage
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_KEY_ACTIVE);
    let parsedData;

    try {
      parsedData = JSON.parse(storedData);
    } catch {
      parsedData = null;
    }

    if (Array.isArray(parsedData) && parsedData.length > 0) {
      setTableData(parsedData);
    } else {
      setTableData(mockData);
      localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(mockData));
    }
  }, []);

  // sync active data to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(tableData));
  }, [tableData]);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const pendingData = tableData.filter(
    (item) => item.status !== "Approved" && item.status !== "Rejected"
  );

  const filteredData = pendingData.filter((item) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(searchValue))
    )
  );

  const handleDelete = async (entryToDelete) => {
    try {
      const updatedData = tableData.filter((e) => e.id !== entryToDelete.id);
      setTableData(updatedData);

      const currentTrash =
        JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
      const newTrash = [...currentTrash, entryToDelete];
      localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(newTrash));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleArchive = async (entryToArchive) => {
    try {
      // remove from active list
      const updatedData = tableData.filter((e) => e.id !== entryToArchive.id);
      setTableData(updatedData);
      // archive logic
      const currentArchive =
        JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
      const newArchive = [...currentArchive, entryToArchive];
      localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(newArchive));
    } catch (error) {
      console.error("Failed to archive entry:", error);
    }
  };

  return (
    <div>
      <Total />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onArchive={handleArchive}
      />
    </div>
  );
};

export default Expenses;

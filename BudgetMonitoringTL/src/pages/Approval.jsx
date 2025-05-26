import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import DataTable from "../components/DataTable";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_ARCHIVE = "archiveData";
const LOCAL_KEY_IMPORTANT = "importantData";
const LOCAL_KEY_TRASH = "trashData";

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);

  const archiveData = JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
  const importantData =
    JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];

  const totalComputationData = [...tableData, ...archiveData, ...importantData];

  // Load data from localStorage only once
  useExpenseDataLoader({
    setTableData,
    LOCAL_KEY_ACTIVE,
    LOCAL_KEY_ARCHIVE,
    LOCAL_KEY_IMPORTANT,
    LOCAL_KEY_TRASH,
    mockData,
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(tableData));
  }, [tableData]);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handleDelete = async (entryToDelete) => {
    try {
      const updatedData = tableData.filter((e) => e.id !== entryToDelete.id);
      setTableData(updatedData);

      const deletedEntry = { ...entryToDelete, status: "Deleted" };

      const currentTrash =
        JSON.parse(localStorage.getItem(LOCAL_KEY_TRASH)) || [];
      const newTrash = [...currentTrash, deletedEntry];
      localStorage.setItem(LOCAL_KEY_TRASH, JSON.stringify(newTrash));
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const handleArchive = async (entryToArchive) => {
    try {
      const updatedData = tableData.filter((e) => e.id !== entryToArchive.id);
      setTableData(updatedData);

      const currentArchive =
        JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
      const newArchive = [...currentArchive, entryToArchive];
      localStorage.setItem(LOCAL_KEY_ARCHIVE, JSON.stringify(newArchive));
    } catch (error) {
      console.error("Failed to archive entry:", error);
    }
  };

  const handleToggleImportant = async (entryToImportant) => {
    const updatedData = tableData.filter((e) => e.id !== entryToImportant.id);
    setTableData(updatedData);

    const currentImportant =
      JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];

    const newImportant = currentImportant.some(
      (item) => item.id === entryToImportant.id
    )
      ? currentImportant
      : [...currentImportant, entryToImportant];

    localStorage.setItem(LOCAL_KEY_IMPORTANT, JSON.stringify(newImportant));
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const approvedData = tableData.filter((item) => item.status === "Approved");

  const filteredData = approvedData.filter((item) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(searchValue))
    )
  );

  return (
    <div>
      <Total data={totalComputationData} />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onToggleImportant={handleToggleImportant}
      />
    </div>
  );
};

export default Approval;

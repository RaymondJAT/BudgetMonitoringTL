import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";
import { columns } from "../mock-data/tableHeader";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_ARCHIVE = "archiveData";
const LOCAL_KEY_TRASH = "trashData";

const Reject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  // Load from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem(LOCAL_KEY_ACTIVE);
    const storedTrash = localStorage.getItem(LOCAL_KEY_TRASH);
    let parsedData = [];
    let trashData = [];

    try {
      parsedData = JSON.parse(storedData) || [];
    } catch {
      parsedData = [];
    }

    try {
      trashData = JSON.parse(storedTrash) || [];
    } catch {
      trashData = [];
    }

    if (parsedData.length > 0) {
      setTableData(parsedData);
    } else {
      const storedArchive = localStorage.getItem(LOCAL_KEY_ARCHIVE);
      let archiveData = [];

      try {
        archiveData = JSON.parse(storedArchive) || [];
      } catch {
        archiveData = [];
      }

      const filteredMockData = mockData.filter(
        (item) =>
          !trashData.find((trash) => trash.id === item.id) &&
          !archiveData.find((archived) => archived.id === item.id)
      );

      setTableData(filteredMockData);
      localStorage.setItem(LOCAL_KEY_ACTIVE, JSON.stringify(filteredMockData));
    }
  }, []);

  // Sync active data to localStorage
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

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const rejectedData = tableData.filter((item) => item.status === "Rejected");

  const filteredData = rejectedData.filter((item) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(searchValue))
    )
  );

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

export default Reject;

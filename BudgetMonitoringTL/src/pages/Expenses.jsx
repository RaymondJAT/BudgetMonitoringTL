import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockData } from "../mock-data/mockData";
import { columns } from "../mock-data/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import DataTable from "../components/DataTable";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";
import ExpenseReport from "../components/ExpenseReport";
import AppButton from "../components/AppButton";
import Swal from "sweetalert2";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_TRASH = "trashData";
const LOCAL_KEY_ARCHIVE = "archiveData";
const LOCAL_KEY_IMPORTANT = "importantData";

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const navigate = useNavigate();

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const archiveData = JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
  const importantData =
    JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];
  const totalComputationData = [...tableData, ...archiveData, ...importantData];

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

  const getSelectedEntriesArray = () =>
    filteredData.filter((entry) => selectedRows[entry.id]);
  const selectedEntriesArray = getSelectedEntriesArray();

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

  const handlePrint = () => {
    console.log("Print clicked", selectedEntriesArray);
    // Add your print logic here using selectedEntriesArray
  };

  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;

    Swal.fire({
      title: `Delete ${selectedCount} selected entr${
        selectedCount === 1 ? "y" : "ies"
      }?`,
      text: "This action will move them to Trash. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete all
        selectedEntriesArray.forEach((entry) => handleDelete(entry));
        // Clear selection
        setSelectedRows({});
        Swal.fire("Deleted!", "Entries have been moved to Trash.", "success");
      }
    });
  };

  return (
    <div>
      <Total data={totalComputationData} />
      <ToolBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        leftContent={
          selectedCount > 0 && (
            <>
              {selectedCount === 1 && (
                <AppButton
                  label={
                    <>
                      <MdLocalPrintshop style={{ marginRight: "5px" }} />
                      Print
                    </>
                  }
                  size="sm"
                  className="custom-app-button no-hover"
                  variant="outline-primary"
                  onClick={handlePrint}
                />
              )}
              {selectedCount >= 2 && (
                <AppButton
                  label={
                    <>
                      <MdDelete style={{ marginRight: "5px" }} />
                      Delete
                    </>
                  }
                  size="sm"
                  className="custom-app-button no-hover"
                  variant="outline-danger"
                  onClick={handleDeleteSelected}
                />
              )}
            </>
          )
        }
      />

      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onToggleImportant={handleToggleImportant}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />

      <div style={{ display: "none" }}>
        <ExpenseReport />
      </div>
    </div>
  );
};

export default Expenses;

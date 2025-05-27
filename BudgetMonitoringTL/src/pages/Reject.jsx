import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { moveEntries } from "../utils/entryActions";
import { MdLocalPrintshop, MdDelete } from "react-icons/md";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import DataTable from "../components/DataTable";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";
import AppButton from "../components/AppButton";
import Swal from "sweetalert2";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_ARCHIVE = "archiveData";
const LOCAL_KEY_IMPORTANT = "importantData";
const LOCAL_KEY_TRASH = "trashData";

const Reject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

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

  const rejectedData = tableData.filter((item) => item.status === "Rejected");

  const filteredData = rejectedData.filter((item) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(searchValue))
    )
  );

  const handleDelete = (entryToDelete) => {
    moveEntries({
      entriesToMove: [{ ...entryToDelete, status: "Deleted" }],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_TRASH,
      avoidDuplicates: true,
    });
  };

  const handleArchive = (entryToArchive) => {
    moveEntries({
      entriesToMove: [entryToArchive],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_ARCHIVE,
      avoidDuplicates: true,
    });
  };

  const handleToggleImportant = (entryToImportant) => {
    moveEntries({
      entriesToMove: [entryToImportant],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_IMPORTANT,
      avoidDuplicates: true,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedCount < 1) return;

    Swal.fire({
      title: `Delete ${selectedCount} selected entr${
        selectedCount === 1 ? "y" : "ies"
      }?`,
      text: "This will move them to Trash. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      const deletedEntries = tableData
        .filter((entry) => seletedRows[entry.id])
        .map((entry) => ({ ...entry, status: "Deleted" }));

      moveEntries({
        entriesToMove: deletedEntries,
        sourceData: tableData,
        setSourceData: setTableData,
        destinationKey: LOCAL_KEY_TRASH,
        avoidDuplicates: true,
      });

      setSelecetedRows({});
      Swal.fire("Deleted!", "Entries moved to Trash.", "success");
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
              <AppButton label={<></>} />
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
      />
    </div>
  );
};

export default Reject;

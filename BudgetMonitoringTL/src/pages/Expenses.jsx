import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { moveEntries } from "../utils/entryActions";
import { useReactToPrint } from "react-to-print";
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
  const [particulars, setParticulars] = useState([]);
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const archiveData = JSON.parse(localStorage.getItem(LOCAL_KEY_ARCHIVE)) || [];
  const importantData =
    JSON.parse(localStorage.getItem(LOCAL_KEY_IMPORTANT)) || [];
  const totalComputationData = [...tableData, ...archiveData, ...importantData];

  const employeeData = mockData.find((e) => e.employee === data?.employee) || {
    transactions: [],
  };
  const transactions = employeeData.transactions;

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

  useEffect(() => {
    const items = transactions.map((item) => ({
      label: item.label ?? "N/A",
      quantity: item.quantity ?? 0,
      price: item.price ?? 0,
      amount: (item.quantity ?? 0) * (item.price ?? 0),
    }));

    const isSame = JSON.stringify(particulars) === JSON.stringify(items);

    if (!isSame) {
      setParticulars(items);
    }
  }, [transactions]);

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

  // delete meatball action
  const handleDelete = (entryToDelete) => {
    moveEntries({
      entriesToMove: [entryToDelete],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_TRASH,
      statusUpdate: "Deleted",
    });
  };

  // archive meatball action
  const handleArchive = (entryToArchive) => {
    moveEntries({
      entriesToMove: [entryToArchive],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_ARCHIVE,
    });
  };

  // important meatball action
  const handleToggleImportant = (entryToImportant) => {
    moveEntries({
      entriesToMove: [entryToImportant],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEY_IMPORTANT,
      avoidDuplicates: true,
    });
  };

  // delete selected row toolbar
  const handleDeleteSelected = () => {
    if (selectedCount < 1) return;

    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );

    Swal.fire({
      title: `Delete ${selectedEntries.length} selected entr${
        selectedEntries.length === 1 ? "y" : "ies"
      }?`,
      text: "This action will move them to Trash. Do you want to proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (!result.isConfirmed) return;

      moveEntries({
        entriesToMove: selectedEntries,
        sourceData: tableData,
        setSourceData: setTableData,
        destinationKey: LOCAL_KEY_TRASH,
        statusUpdate: "Deleted",
      });

      setSelectedRows({});
      Swal.fire("Deleted!", "Entries have been moved to Trash.", "success");
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
                <>
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
                    onClick={reactToPrintFn}
                  />
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
                </>
              )}

              {selectedCount > 1 && (
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
        <ExpenseReport contentRef={contentRef} />
      </div>
    </div>
  );
};

export default Expenses;

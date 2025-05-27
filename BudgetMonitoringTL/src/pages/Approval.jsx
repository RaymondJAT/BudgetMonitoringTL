import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { moveEntries } from "../utils/entryActions";
import { printData } from "../utils/printData";
import Total from "../components/layout/Total";
import ToolBar from "../components/layout/ToolBar";
import DataTable from "../components/layout/DataTable";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";
import ExpenseReport from "../components/print/ExpenseReport";
import AppButton from "../components/ui/AppButton";
import Swal from "sweetalert2";

const LOCAL_KEY_ACTIVE = "expensesData";
const LOCAL_KEY_ARCHIVE = "archiveData";
const LOCAL_KEY_IMPORTANT = "importantData";
const LOCAL_KEY_TRASH = "trashData";

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [particulars, setParticulars] = useState([]);
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const approvedData = tableData.filter((item) => item.status === "Approved");
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
    const items = printData(transactions);
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

  const filteredData = approvedData.filter((item) =>
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
        .filter((entry) => selectedRows[entry.id])
        .map((entry) => ({ ...entry, status: "Deleted" }));

      moveEntries({
        entriesToMove: deletedEntries,
        sourceData: tableData,
        setSourceData: setTableData,
        destinationKey: LOCAL_KEY_TRASH,
        avoidDuplicates: true,
      });

      setSelectedRows({});
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

export default Approval;

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { moveEntries } from "../utils/entryActions";
import { printData } from "../utils/printData";
import { MdLocalPrintshop, MdDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { deleteItems } from "../utils/deleteItems";
import Total from "../components/layout/Total";
import ToolBar from "../components/layout/ToolBar";
import DataTable from "../components/layout/DataTable";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";
import ExpenseReport from "../components/print/ExpenseReport";
import AppButton from "../components/ui/AppButton";

const LOCAL_KEYS = {
  ACTIVE: "expensesData",
  TRASH: "trashData",
  ARCHIVE: "archiveData",
  IMPORTANT: "importantData",
};

const Reject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [tableData, setTableData] = useState([]);
  const [particulars, setParticulars] = useState([]);
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;
  const rejectedData = tableData.filter((item) => item.status === "Rejected");
  const archiveData =
    JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
  const importantData =
    JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
  const totalComputationData = [...tableData, ...archiveData, ...importantData];
  const employeeData = mockData.find((e) => e.employee === data?.employee) || {
    transactions: [],
  };
  const transactions = employeeData.transactions;

  useExpenseDataLoader({
    setTableData,
    LOCAL_KEY_ACTIVE: LOCAL_KEYS.ACTIVE,
    LOCAL_KEY_ARCHIVE: LOCAL_KEYS.ARCHIVE,
    LOCAL_KEY_IMPORTANT: LOCAL_KEYS.IMPORTANT,
    LOCAL_KEY_TRASH: LOCAL_KEYS.TRASH,
    mockData,
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(tableData));
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
      destinationKey: LOCAL_KEYS.TRASH,
      avoidDuplicates: true,
    });
  };

  const handleArchive = (entryToArchive) => {
    moveEntries({
      entriesToMove: [entryToArchive],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.ARCHIVE,
      avoidDuplicates: true,
    });
  };

  const handleToggleImportant = (entryToImportant) => {
    moveEntries({
      entriesToMove: [entryToImportant],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.IMPORTANT,
      avoidDuplicates: true,
    });
  };

  const handleDeleteSelected = () => {
    if (selectedCount < 1) return;

    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );

    deleteItems({
      selectedEntries,
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.TRASH,
      setSelectedRows,
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

export default Reject;

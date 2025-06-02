import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { moveEntries } from "../utils/entryActions";
import { useReactToPrint } from "react-to-print";
import { formatPrintData } from "../utils/formatPrintData";
import { deleteItems } from "../utils/deleteItems";
import DataTable from "../components/layout/DataTable";
import Total from "../components/layout/Total";
import ToolBar from "../components/layout/ToolBar";
import useExpenseDataLoader from "../hooks/useExpenseDataLoader";
import ExpenseReport from "../components/print/ExpenseReport";
import AppButton from "../components/ui/AppButton";

const LOCAL_KEYS = {
  ACTIVE: "expensesData",
  TRASH: "trashData",
  ARCHIVE: "archiveData",
  IMPORTANT: "importantData",
};

const STATUS = {
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DELETED: "Deleted",
};

const PrintButton = ({ onClick }) => (
  <AppButton
    label={
      <>
        <MdLocalPrintshop style={{ marginRight: "5px" }} />
        Print
      </>
    }
    size="sm"
    className="custom-app-button"
    variant="outline-dark"
    onClick={onClick}
  />
);

const DeleteButton = ({ onClick }) => (
  <AppButton
    label={
      <>
        <MdDelete style={{ marginRight: "5px" }} />
        Delete
      </>
    }
    size="sm"
    className="custom-app-button"
    variant="outline-danger"
    onClick={onClick}
  />
);

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [particulars, setParticulars] = useState([]);
  const [printData, setPrintData] = useState(null);
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

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
    const items = formatPrintData(transactions);
    const isSame = JSON.stringify(particulars) === JSON.stringify(items);
    if (!isSame) setParticulars(items);
  }, [transactions]);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handlePrint = () => {
    if (!selectedEntry) return;

    setPrintData(selectedEntry);

    setTimeout(() => {
      reactToPrintFn();
    }, 100);
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    return columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () =>
      tableData
        .filter(
          (item) =>
            item.status !== STATUS.APPROVED && item.status !== STATUS.REJECTED
        )
        .filter((item) => isMatch(item, searchValue, columns)),
    [tableData, searchValue]
  );

  const selectedEntry =
    selectedCount === 1
      ? filteredData.find((item) => selectedRows[item.id])
      : null;

  const handleDelete = (entryToDelete) => {
    moveEntries({
      entriesToMove: [entryToDelete],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.TRASH,
      statusUpdate: STATUS.DELETED,
    });
  };

  const handleArchive = (entryToArchive) => {
    moveEntries({
      entriesToMove: [entryToArchive],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.ARCHIVE,
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
                  <PrintButton onClick={handlePrint} />
                  <DeleteButton onClick={handleDeleteSelected} />
                </>
              )}
              {selectedCount > 1 && (
                <DeleteButton onClick={handleDeleteSelected} />
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

      <div className="d-none">
        <ExpenseReport contentRef={contentRef} data={printData || {}} />
      </div>
    </div>
  );
};

export default Expenses;

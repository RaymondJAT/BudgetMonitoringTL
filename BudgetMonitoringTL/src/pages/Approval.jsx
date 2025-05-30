import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockData } from "../handlers/mockData";
import { columns } from "../handlers/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { moveEntries } from "../utils/entryActions";
import { printData } from "../utils/printData";
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

const STATUS = {
  APPROVED: "Approved",
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

const Approval = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const { state: data } = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const approvedData = useMemo(
    () => tableData.filter((item) => item.status === STATUS.APPROVED),
    [tableData]
  );

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

  const filteredData = useMemo(() => {
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();
    return approvedData.filter((item) =>
      columns.some((col) =>
        normalize(item[col.accessor]).includes(normalize(searchValue))
      )
    );
  }, [approvedData, searchValue]);

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const handleMoveEntry = (entry, destinationKey, statusUpdate = null) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey,
      statusUpdate,
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

  const employeeData = useMemo(() => {
    return (
      mockData.find((e) => e.employee === data?.employee) || {
        transactions: [],
      }
    );
  }, [data?.employee]);

  const particulars = useMemo(
    () => printData(employeeData.transactions),
    [employeeData.transactions]
  );

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

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
                  <PrintButton onClick={reactToPrintFn} />
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
        onDelete={(entry) =>
          handleMoveEntry(entry, LOCAL_KEYS.TRASH, STATUS.DELETED)
        }
        onArchive={(entry) => handleMoveEntry(entry, LOCAL_KEYS.ARCHIVE)}
        onToggleImportant={(entry) =>
          handleMoveEntry(entry, LOCAL_KEYS.IMPORTANT)
        }
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
      <div style={{ display: "none" }}>
        <ExpenseReport contentRef={contentRef} particulars={particulars} />
      </div>
    </div>
  );
};

export default Approval;

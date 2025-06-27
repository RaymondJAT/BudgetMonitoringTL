import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { columns } from "../../handlers/tableHeader";
import { MdDelete, MdLocalPrintshop } from "react-icons/md";
import { moveEntries } from "../../utils/entryActions";
import { useReactToPrint } from "react-to-print";
import { formatPrintData } from "../../utils/formatPrintData";
import { deleteItems } from "../../utils/deleteItems";
import { handleExportData } from "../../utils/exportItems";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import DataTable from "../../components/layout/DataTable";
import Total from "../../components/layout/TotalTeamLead";
import ToolBar from "../../components/layout/ToolBar";
import ExpenseReport from "../../components/print/ExpenseReport";
import AppButton from "../../components/ui/AppButton";

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
  const downloadRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ content: () => contentRef.current });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  const transactions = tableData || [];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
    setTableData(stored);
  }, []);

  useEffect(() => {
    const items = formatPrintData(transactions);
    const isSame = JSON.stringify(particulars) === JSON.stringify(items);
    if (!isSame) setParticulars(items);
  }, [transactions]);

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/approval-form", { state: entry });
    } else if (entry.formType === "Liquidation") {
      navigate("/liquidation-form", { state: entry });
    }
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
    const fieldsToSearch = [...columns.map((col) => col.accessor), "formType"];
    return fieldsToSearch.some((key) =>
      normalize(item[key]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () =>
      tableData
        .filter(
          (item) =>
            item.status !== STATUS.APPROVED && item.status !== STATUS.REJECTED
        )
        .filter((item) => isMatch(item, searchValue)),
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

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "Expenses",
    });

    setSelectedRows(resetSelection);
  };

  return (
    <div>
      <Total data={totalComputationData} statusList={TEAMLEAD_STATUS_LIST} />
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
        handleExport={handleExport}
        selectedCount={selectedCount}
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
        downloadRef={downloadRef}
        setPrintData={setPrintData}
      />

      <div className="d-none">
        <ExpenseReport contentRef={contentRef} data={printData || {}} />
        <ExpenseReport contentRef={downloadRef} data={printData || {}} />
      </div>
    </div>
  );
};

export default Expenses;

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { mockData } from "../../handlers/mockData";
import { columns } from "../../handlers/tableHeader";
import { moveEntries } from "../../utils/entryActions";
import { deleteItems } from "../../utils/deleteItems";
import { MdLocalPrintshop, MdDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { handleExportData } from "../../utils/exportItems";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import Total from "../../components/layout/TotalTeamLead";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import ExpenseReport from "../../components/print/ExpenseReport";
import useExpenseDataLoader from "../../hooks/useExpenseDataLoader";
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

const Reject = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [printData, setPrintData] = useState(null);
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const downloadRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  useExpenseDataLoader({
    setTableData,
    LOCAL_KEY_ACTIVE: LOCAL_KEYS.ACTIVE,
    LOCAL_KEY_ARCHIVE: LOCAL_KEYS.ARCHIVE,
    LOCAL_KEY_IMPORTANT: LOCAL_KEYS.IMPORTANT,
    LOCAL_KEY_TRASH: LOCAL_KEYS.TRASH,
    mockData,
  });

  // useEffect(() => {
  //   localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(tableData));
  // }, [tableData]);

  const rejectedData = useMemo(
    () => tableData.filter((item) => item.status === STATUS.REJECTED),
    [tableData]
  );

  const filteredData = useMemo(() => {
    const normalize = (value) =>
      String(value || "")
        .toLowerCase()
        .trim();
    return rejectedData.filter((item) =>
      columns.some((col) =>
        normalize(item[col.accessor]).includes(normalize(searchValue))
      )
    );
  }, [rejectedData, searchValue]);

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

  const selectedEntry =
    selectedCount === 1
      ? filteredData.find((item) => selectedRows[item.id])
      : null;

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

  const handleExport = () => {
    const resetSelection = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "Reject",
    });

    setSelectedRows(resetSelection);
  };

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

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
        onDelete={(entry) =>
          handleMoveEntry(entry, LOCAL_KEYS.TRASH, STATUS.DELETED)
        }
        onArchive={(entry) => handleMoveEntry(entry, LOCAL_KEYS.ARCHIVE)}
        onToggleImportant={(entry) =>
          handleMoveEntry(entry, LOCAL_KEYS.IMPORTANT)
        }
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        downloadRef={downloadRef}
        setPrintData={setPrintData}
      />

      <div style={{ display: "none" }}>
        <ExpenseReport contentRef={contentRef} data={printData || {}} />
        <ExpenseReport contentRef={downloadRef} data={printData || {}} />
      </div>
    </div>
  );
};

export default Reject;

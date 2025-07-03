import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { STATUS } from "../../constants/status";
import { expenseHeaders } from "../../handlers/columnHeaders";
import { deleteItems } from "../../utils/deleteItems";
import { moveEntries } from "../../utils/entryActions";
import { handleExportData } from "../../utils/exportItems";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";

import DataTable from "../../components/layout/DataTable";
import CashReqModal from "../../components/ui/modal/employee/CashReqModal";
import LiqFormModal from "../../components/ui/modal/employee/LiqFormModal";
import TotalCards from "../../components/TotalCards";
import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";

const MyExpenses = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showCashReqModal, setShowCashReqModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);
  const navigate = useNavigate();

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  // Load fresh data from localStorage once on mount
  const loadActiveExpenses = () => {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_ACTIVE)) || [];

    const filtered = raw.filter((item) => item.status !== STATUS.DELETED);

    const sorted = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTableData(sorted);
  };

  useEffect(() => {
    loadActiveExpenses();

    const handleRestoreEvent = () => {
      loadActiveExpenses();
    };

    window.addEventListener("expenses-updated", handleRestoreEvent);
    return () => {
      window.removeEventListener("expenses-updated", handleRestoreEvent);
    };
  }, []);

  const archiveData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_ARCHIVE)) || [];
  }, []);

  const importantData = useMemo(() => {
    return JSON.parse(localStorage.getItem(LOCAL_KEYS.EMP_IMPORTANT)) || [];
  }, []);

  const totalComputationData = useMemo(
    () => [...tableData, ...archiveData, ...importantData],
    [tableData, archiveData, importantData]
  );

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fields = [...expenseHeaders.map((col) => col.accessor), "formType"];
    return fields.some((key) =>
      normalize(item[key]).includes(normalize(value))
    );
  };

  const filteredData = useMemo(
    () => tableData.filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/cash-form", { state: entry });
    } else if (entry.formType === "Liquidation") {
      navigate("/liquid-form", { state: entry });
    }
  };

  const handleDelete = (entry) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.EMP_TRASH,
      statusUpdate: STATUS.DELETED,
    });

    setTimeout(() => {
      loadActiveExpenses();
    }, 100); // small delay ensures localStorage is updated
  };

  const handleDeleteSelected = () => {
    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );

    deleteItems({
      selectedEntries,
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.EMP_TRASH,
      setSelectedRows,
      statusUpdate: STATUS.DELETED,
    });

    setTimeout(() => {
      loadActiveExpenses();
    }, 100);
  };

  const handleArchive = (entry) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.EMP_ARCHIVE,
    });
  };

  const handleToggleImportant = (entry) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: LOCAL_KEYS.EMP_IMPORTANT,
      avoidDuplicates: true,
    });
  };

  const handleExport = () => {
    const reset = handleExportData({
      filteredData,
      selectedRows,
      selectedCount,
      filename: "MyExpenses",
    });
    setSelectedRows(reset);
  };

  const dropdownItems = [
    {
      label: "Cash Request Form",
      onClick: () => setShowCashReqModal(true),
    },
    {
      label: "Liquidation Form",
      onClick: () => setShowLiqFormModal(true),
    },
  ];

  const newButton = (
    <AppButton
      label="Create Request"
      isDropdown
      dropdownItems={dropdownItems}
      size="sm"
      variant="outline-dark"
      className="custom-app-button"
    />
  );

  return (
    <div>
      <TotalCards data={totalComputationData} list={EMPLOYEE_STATUS_LIST} />
      <ToolBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        leftContent={newButton}
        handleExport={handleExport}
        selectedCount={selectedCount}
      />
      <DataTable
        data={filteredData}
        columns={expenseHeaders}
        onRowClick={handleRowClick}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onToggleImportant={handleToggleImportant}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />

      {/* CASH REQUEST MODAL */}
      <CashReqModal
        show={showCashReqModal}
        onHide={() => setShowCashReqModal(false)}
        onSubmit={(newData) => {
          const raw = JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
          const updated = raw.filter(
            (item) =>
              item.status !== STATUS.DELETED &&
              item.status !== STATUS.APPROVED &&
              item.status !== STATUS.REJECTED
          );
          const sorted = [...updated].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTableData(sorted);
        }}
      />

      {/* LIQUIDATION MODAL */}
      <LiqFormModal
        show={showLiqFormModal}
        onHide={() => setShowLiqFormModal(false)}
      />
    </div>
  );
};

export default MyExpenses;

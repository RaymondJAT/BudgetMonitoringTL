import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { expenseHeaders } from "../../handlers/columnHeaders";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import TotalEmployee from "../../components/layout/TotalEmployee";
import DataTable from "../../components/layout/DataTable";
import CashReqModal from "../../components/ui/modal/employee/CashReqModal";
import LiqFormModal from "../../components/ui/modal/employee/LiqFormModal";

const MyExpenses = () => {
  const [tableData, setTableData] = useState(() => {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
    return raw.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  });
  const [selectedRows, setSelectedRows] = useState({});
  const [showCashReqModal, setShowCashReqModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = JSON.parse(localStorage.getItem(LOCAL_KEYS.ACTIVE)) || [];
      const sorted = [...updated].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTableData(sorted);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(tableData));
  }, [tableData]);

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

  const handleRowClick = (entry) => {
    if (entry.formType === "Cash Request") {
      navigate("/cash-form", { state: entry });
    } else if (entry.formType === "Liquidation") {
      navigate("/liquid-form", { state: entry });
    }
  };

  const handleDelete = (entry) => {
    const updated = tableData.filter((item) => item.id !== entry.id);
    setTableData(updated);
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updated));
  };

  const handleArchive = (entry) => {
    const updated = tableData.filter((item) => item.id !== entry.id);
    localStorage.setItem(
      LOCAL_KEYS.ARCHIVE,
      JSON.stringify([...archiveData, entry])
    );
    setTableData(updated);
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updated));
  };

  const handleToggleImportant = (entry) => {
    const updated = tableData.filter((item) => item.id !== entry.id);
    localStorage.setItem(
      LOCAL_KEYS.IMPORTANT,
      JSON.stringify([...importantData, entry])
    );
    setTableData(updated);
    localStorage.setItem(LOCAL_KEYS.ACTIVE, JSON.stringify(updated));
  };

  return (
    <div>
      <TotalEmployee data={totalComputationData} />
      <ToolBar setTableData={setTableData} leftContent={newButton} />

      <DataTable
        data={tableData}
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
        onSubmit={(updatedData) =>
          setTableData(
            [...updatedData].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          )
        }
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

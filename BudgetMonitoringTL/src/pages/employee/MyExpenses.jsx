import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { EMPLOYEE_STATUS_LIST } from "../../constants/employeeStatusList";
import { expenseHeaders } from "../../handlers/columnHeaders";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import Total from "../../components/layout/Total";
import DataTable from "../../components/layout/DataTable";

const MyExpenses = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  const dropdownItems = [
    {
      label: "Cash Request Form",
      onClick: () => navigate("/forms/cash-request"),
    },
    // {
    //   label: "Cash Voucher Form",
    //   onClick: () => navigate("/forms/cash-voucher"),
    // },
    {
      label: "Liquidation Form",
      onClick: () => navigate("/forms/liquidation"),
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

  const handleDelete = (entry) => {
    setTableData((prev) => prev.filter((item) => item.id !== entry.id));
  };

  const handleArchive = (entry) => {
    const updated = tableData.filter((item) => item.id !== entry.id);
    localStorage.setItem(
      LOCAL_KEYS.ARCHIVE,
      JSON.stringify([...archiveData, entry])
    );
    setTableData(updated);
  };

  const handleToggleImportant = (entry) => {
    const updated = tableData.filter((item) => item.id !== entry.id);
    localStorage.setItem(
      LOCAL_KEYS.IMPORTANT,
      JSON.stringify([...importantData, entry])
    );
    setTableData(updated);
  };

  return (
    <div>
      <Total data={totalComputationData} statusList={EMPLOYEE_STATUS_LIST} />
      <ToolBar setTableData={setTableData} leftContent={newButton} />

      <DataTable
        data={tableData}
        columns={expenseHeaders}
        onRowClick={(entry) => console.log("Row clicked:", entry)}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onToggleImportant={handleToggleImportant}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
      />
    </div>
  );
};

export default MyExpenses;

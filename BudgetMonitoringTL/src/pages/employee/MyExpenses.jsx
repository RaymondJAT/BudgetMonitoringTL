import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_KEYS } from "../../constants/localKeys";
import { EMPLOYEE_STATUS_LIST } from "../../constants/employeeStatusList";
import { expenseHeaders } from "../../handlers/columnHeaders";
import { Modal } from "react-bootstrap";
import CashReqForm from "./CashReqForm";
import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import Total from "../../components/layout/Total";
import DataTable from "../../components/layout/DataTable";

const MyExpenses = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [showCashReqModal, setShowCashReqModal] = useState(false);
  const handleCloseModal = () => setShowCashReqModal(false);

  const dropdownItems = [
    {
      label: "Cash Request Form",
      onClick: () => setShowCashReqModal(true),
    },
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

      {/* cash request modal */}
      <Modal
        show={showCashReqModal}
        onHide={handleCloseModal}
        dialogClassName="modal-xl"
        centered
        scrollable
      >
        <Modal.Header closeButton style={{ backgroundColor: "#EFEEEA" }}>
          <Modal.Title className="text-uppercase">
            Cash Request Form
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="cashreq-scroll"
          style={{ backgroundColor: "#800000" }}
        >
          <CashReqForm data={{}} signatures={{}} particulars={[]} />
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#EFEEEA" }}>
          <AppButton
            label="Close"
            variant="outline-danger"
            onClick={handleCloseModal}
            className="custom-app-button"
          />
          <AppButton
            label="Submit"
            variant="outline-success"
            className="custom-app-button"
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyExpenses;

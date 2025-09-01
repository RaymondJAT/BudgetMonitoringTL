import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";
import { deleteItems } from "../../utils/deleteItems";
import { moveEntries } from "../../utils/entryActions";
import { handleExportData } from "../../utils/exportItems";
import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";

import ToolBar from "../../components/layout/ToolBar";
import AppButton from "../../components/ui/AppButton";
import DataTable from "../../components/layout/DataTable";
import CashReqModal from "../../components/ui/modal/employee/CashReqModal";
import LiqFormModal from "../../components/ui/modal/employee/LiqFormModal";
import TotalCards from "../../components/TotalCards";

const MyExpenses = () => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [showCashReqModal, setShowCashReqModal] = useState(false);
  const [showLiqFormModal, setShowLiqFormModal] = useState(false);
  const navigate = useNavigate();

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const archiveData = useMemo(() => [], []);
  const importantData = useMemo(() => [], []);

  const totalComputationData = useMemo(
    () => [...tableData, ...archiveData, ...importantData],
    [tableData, archiveData, importantData]
  );

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const isMatch = (item, value) => {
    const fields = [...columns.map((col) => col.accessor), "formType"];
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
      destinationKey: null,
      statusUpdate: STATUS.DELETED,
    });
  };

  const handleDeleteSelected = () => {
    const selectedEntries = filteredData.filter(
      (entry) => selectedRows[entry.id]
    );

    deleteItems({
      selectedEntries,
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: null,
      setSelectedRows,
      statusUpdate: STATUS.DELETED,
    });
  };

  const handleArchive = (entry) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: null,
    });
  };

  const handleToggleImportant = (entry) => {
    moveEntries({
      entriesToMove: [entry],
      sourceData: tableData,
      setSourceData: setTableData,
      destinationKey: null,
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

  const selectAllCheckbox = (
    <Form.Check
      type="checkbox"
      checked={
        filteredData.length > 0 &&
        filteredData.every((entry) => selectedRows[entry.id])
      }
      onChange={(e) => {
        const checked = e.target.checked;
        const newSelection = {};
        filteredData.forEach((entry) => {
          newSelection[entry.id] = checked;
        });
        setSelectedRows(newSelection);
      }}
      className="d-lg-none"
      style={{ marginTop: "3px" }}
      title="Select All"
    />
  );

  const leftContent = (
    <div className="d-flex align-items-center gap-2">
      {selectAllCheckbox}
      <AppButton
        label={
          <>
            <FaPlus />
            <span className="d-none d-sm-inline ms-1">Request</span>
          </>
        }
        size="sm"
        variant="outline-dark"
        onClick={() => setShowCashReqModal(true)}
        className="custom-app-button"
      />
    </div>
  );

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={EMPLOYEE_STATUS_LIST} />
      </div>
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            leftContent={leftContent}
            handleExport={handleExport}
            selectedCount={selectedCount}
            searchBarWidth="300px"
          />

          <DataTable
            data={filteredData}
            height="350px"
            columns={columns}
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
              setTableData((prev) => [newData, ...prev]);
            }}
          />

          {/* LIQUIDATION MODAL */}
          <LiqFormModal
            show={showLiqFormModal}
            onHide={() => setShowLiqFormModal(false)}
            onSubmit={(newForm) => {
              setTableData((prev) => [newForm, ...prev]);
            }}
          />
        </div>
      </Container>
    </div>
  );
};

export default MyExpenses;

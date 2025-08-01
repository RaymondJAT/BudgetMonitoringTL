import { useState, useMemo } from "react";
import { Container, Form } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { revolvingFundColumns } from "../../constants/revolvingFundColumn";
import { LOCAL_KEYS } from "../../constants/localKeys";

import { handleExportData } from "../../utils/exportItems";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";
import AppButton from "../../components/ui/AppButton";

const RevolvingFund = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.FNCE_IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

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
    console.log("View", entry);
  };

  const handleDelete = (entry) => {
    console.log("Delete", entry);
  };

  const handleArchive = (entry) => {
    console.log("Archive", entry);
  };

  const handleToggleImportant = (entry) => {
    console.log("Toggle Important", entry);
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
            <span className="d-none d-sm-inline ms-1">Revolving Fund</span>
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
    <>
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
      </div>

      <Container fluid className="pb-3">
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
            data={tableData}
            columns={revolvingFundColumns}
            height="350px"
            onRowClick={handleRowClick}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onToggleImportant={handleToggleImportant}
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
          />
        </div>
      </Container>
    </>
  );
};

export default RevolvingFund;

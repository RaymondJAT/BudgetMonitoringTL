import { useState, useMemo, useEffect } from "react";
import { Container } from "react-bootstrap";

import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";
import { columns } from "../../handlers/tableHeader";
import { LOCAL_KEYS } from "../../constants/localKeys";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const EmpLiquidation = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});

  const loadLiquidationData = () => {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEYS.LIQUIDATION)) || [];
    const sorted = [...raw].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setTableData(sorted);
  };

  useEffect(() => {
    loadLiquidationData();

    const handleUpdate = () => loadLiquidationData();
    window.addEventListener("liquidations-updated", handleUpdate);
    return () =>
      window.removeEventListener("liquidations-updated", handleUpdate);
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

  return (
    <>
      <div className="pb-3">
        <div className="mt-3">
          <TotalCards data={totalComputationData} list={EMPLOYEE_STATUS_LIST} />
        </div>
        <Container fluid>
          <div className="custom-container shadow-sm rounded p-3">
            <ToolBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectedCount={Object.values(selectedRows).filter(Boolean).length}
            />
            <DataTable
              data={filteredData}
              height="355px"
              columns={columns}
              onRowClick={() => {}}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
            />
          </div>
        </Container>
      </div>
    </>
  );
};

export default EmpLiquidation;

import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { EMPLOYEE_STATUS_LIST } from "../../constants/totalList";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const EmpLiquidation = () => {
  const [tableData, setTableData] = useState([]); // start blank
  const [searchValue, setSearchValue] = useState("");
  const [selectedRows, setSelectedRows] = useState({});

  const totalComputationData = useMemo(() => tableData, [tableData]);

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
  );
};

export default EmpLiquidation;

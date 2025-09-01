import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const Liquidation = () => {
  const [tableData] = useState([]); 
  const [searchValue, setSearchValue] = useState("");

 
  const totalComputationData = useMemo(() => {
    return [...tableData];
  }, [tableData]);

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

  return (
    <div className="pb-3">
      <div className="mt-3">
        <TotalCards data={totalComputationData} list={TEAMLEAD_STATUS_LIST} />
      </div>
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
          <DataTable data={filteredData} height="455px" columns={columns} />
        </div>
      </Container>
    </div>
  );
};

export default Liquidation;

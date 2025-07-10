import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { TEAMLEAD_STATUS_LIST } from "../../constants/totalList";
import { STATUS } from "../../constants/status";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const Liquidation = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  });

  const transactions = tableData || [];

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
    <>
      <TotalCards data={totalComputationData} list={TEAMLEAD_STATUS_LIST} />
      <Container fluid>
        <div className="custom-container shadow-sm rounded p-3">
          <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
          <DataTable data={filteredData} height="460px" columns={columns} />
        </div>
      </Container>
    </>
  );
};

export default Liquidation;

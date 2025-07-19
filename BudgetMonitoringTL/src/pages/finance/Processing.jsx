import { useState, useMemo } from "react";
import { Container } from "react-bootstrap";

import { LOCAL_KEYS } from "../../constants/localKeys";
import { FINANCE_STATUS_LIST } from "../../constants/totalList";
import { columns } from "../../handlers/tableHeader";

import TotalCards from "../../components/TotalCards";
import ToolBar from "../../components/layout/ToolBar";
import DataTable from "../../components/layout/DataTable";

const Processing = () => {
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const totalComputationData = useMemo(() => {
    const archiveData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.ARCHIVE)) || [];
    const importantData =
      JSON.parse(localStorage.getItem(LOCAL_KEYS.IMPORTANT)) || [];
    return [...tableData, ...archiveData, ...importantData];
  }, [tableData]);

  const filteredData = useMemo(
    () => tableData.filter((item) => isMatch(item, searchValue)),
    [tableData, searchValue]
  );

  return (
    <>
      <div className="pb-3">
        <div className="mt-3">
          <TotalCards data={totalComputationData} list={FINANCE_STATUS_LIST} />
        </div>
        <Container fluid>
          <div className="custom-container shadow-sm rounded p-3">
            <ToolBar
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />
            <DataTable data={filteredData} height="355px" columns={columns} />
          </div>
        </Container>
      </div>
    </>
  );
};

export default Processing;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";
import { columns } from "../mock-data/tableHeader";

const Reject = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const rejectedData = mockData.filter((item) => item.status === "Rejected");

  const filteredData = rejectedData.filter((item) =>
    columns.some((col) =>
      normalize(item[col.accessor]).includes(normalize(searchValue))
    )
  );

  return (
    <div>
      <Total />
      <ToolBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <DataTable
        data={filteredData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
};


export default Reject;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";
import { columns } from "../mock-data/tableHeader";

const Expenses = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleRowClick = (entry) => {
    navigate("/approval-form", { state: entry });
  };

  const normalize = (value) =>
    String(value || "")
      .toLowerCase()
      .trim();

  const filteredData = mockData.filter((item) =>
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

export default Expenses;

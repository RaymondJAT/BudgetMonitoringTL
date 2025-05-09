import React from "react";
import DataTable from "../components/DataTable";
import { mockData } from "../mock-data/mockData";
import Total from "../components/Total";
import ToolBar from "../components/ToolBar";

const columns = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Category", accessor: "category" },
  { header: "Paid By", accessor: "paidBy" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
];

const Expenses = () => {
  const handleRowClick = (entry) => {
    console.log("Clicked row:", entry);
  };

  return (
    <div className="expense-container">
      <ToolBar />
      <Total />
      {/* <ExpenseReport /> */}
      <DataTable
        data={mockData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default Expenses;

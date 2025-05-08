import React from "react";
import ExpenseTable from "../components/ExpenseTable";
import { mockData } from "../mock-data/mockData";
import ExpenseReport from "../components/ExpenseReport";

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
    <>
      {/* <ExpenseReport /> */}
      <ExpenseTable
        data={mockData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    </>
  );
};

export default Expenses;

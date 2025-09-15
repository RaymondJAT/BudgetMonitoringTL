export const columns = [
  { label: "Reference ID", accessor: "reference_id" },
  { label: "Employee", accessor: "employee" },
  { label: "Department", accessor: "department" },
  { label: "Particulars", accessor: "description" },
  { label: "Amount", accessor: "amount" },
  { label: "Status", accessor: "status" },
  { label: "Request Date", accessor: "request_date" },
];

export const liquidationColumns = [
  { label: "Reference ID", accessor: "reference_id" },
  { label: "Employee", accessor: "employee" },
  { label: "Department", accessor: "department" },
  { label: "Particulars", accessor: "description" },
  { label: "Amount", accessor: "amount_obtained" },
  { label: "Status", accessor: "status" },
  { label: "Liquidation Date", accessor: "created_date" },
];

export const liquidationFinanceColumns = [
  { label: "Reference ID", accessor: "cr_reference_id" },
  { label: "Employee", accessor: "employee" },
  { label: "Department", accessor: "department" },
  { label: "Particulars", accessor: "description" },
  { label: "Amount", accessor: "amount_obtained" },
  { label: "Status", accessor: "status" },
  { label: "Liquidation Date", accessor: "created_date" },
];

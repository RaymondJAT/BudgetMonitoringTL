export const columns = [
  { label: "Reference ID", accessor: "reference_id" },
  { label: "Employee", accessor: "employee" },
  { label: "Department", accessor: "department" },
  { label: "Particulars", accessor: "description" },
  { label: "Price", accessor: "price" },
  { label: "Quantity", accessor: "quantity" },
  { label: "Amount", accessor: "subtotal" },
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

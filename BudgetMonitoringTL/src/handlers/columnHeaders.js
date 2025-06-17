export const colHeaders = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Category", accessor: "category" },
  { header: "Paid By", accessor: "paidBy" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
];

export const archiveColumns = [...colHeaders];
export const importantColumns = [...colHeaders];
export const trashColumns = [...colHeaders];

export const expenseHeaders = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Expense Date", accessor: "expenseDate" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
];

export const cashReqFields = [
  { label: "Employee", key: "employee" },
  { label: "Expense Date", key: "expenseDate", type: "date" },
  { label: "Department", key: "department" },
  { label: "Team Lead", key: "teamLead" },
  { label: "Position", key: "position" },
];

export const approvalFormFields = [
  { label: "Position", key: "position" },
  { label: "Total", key: "total" },
];

export const approvalPartnerFields = [
  { label: "Employee", key: "employee" },
  { label: "Expense Date", key: "expenseDate" },
  { label: "Department", key: "department" },
  { label: "Team Lead", key: "teamLead" },
];

// liquidation form
export const liquidationFields = [
  [
    { key: "employee", label: "Employee", type: "text", col: 6 },
    { key: "amountObtained", label: "Amount Obtained", type: "number", col: 6 },
  ],
  [
    { key: "department", label: "Department", type: "text", col: 6 },
    { key: "amountExpended", label: "Amount Expended", type: "number", col: 6 },
  ],
  [
    {
      key: "liquidationDate",
      label: "Date of Liquidation",
      type: "date",
      col: 6,
    },
    {
      key: "reimburseReturn",
      label: "Reimburse / Return",
      type: "number",
      col: 6,
    },
  ],
];

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

// cash request form
export const cashReqFields = [
  { label: "Employee", key: "employee" },
  { label: "Expense Date", key: "expenseDate", type: "date" },
  { label: "Department", key: "department" },
  { label: "Team Lead", key: "teamLead" },
  { label: "Position", key: "position" },
];

// liquidation form
export const formFields = [
  [
    { controlId: "employee", label: "Employee", name: "employee" },
    { controlId: "department", label: "Department", name: "department" },
    {
      controlId: "date",
      label: "Date of Liquidation",
      name: "date",
      type: "date",
    },
  ],
  [
    {
      controlId: "amountObtained",
      label: "Amount Obtained",
      name: "amountObtained",
      type: "number",
      min: 0,
    },
    {
      controlId: "amountExpended",
      label: "Amount Expended",
      name: "amountExpended",
      type: "number",
      min: 0,
    },
    {
      controlId: "reimburseOrReturn",
      label: "Reimburse/Return",
      name: "reimburseOrReturn",
      type: "number",
      min: 0,
    },
  ],
];

export const colHeaders = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Category", accessor: "category" },
  { header: "Paid By", accessor: "paidBy" },
  {
    header: "Amount",
    accessor: (row) => {
      const value =
        row.formType === "Liquidation" ? row.amountObtained : row.total;

      return value != null
        ? `₱${parseFloat(value).toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}`
        : "₱0.00";
    },
  },
  { header: "Status", accessor: "status" },
];

export const archiveColumns = [...colHeaders];
export const importantColumns = [...colHeaders];
export const trashColumns = [...colHeaders];

// cash request fields
export const approvalFormFields = [{ label: "Amount", key: "amount" }];

export const approvalPartnerFields = [
  { label: "Employee", key: "employee" },
  { label: "Reference ID", key: "reference_id" },
  { label: "Department", key: "department" },
  { label: "Request Date", key: "request_date" },
  { label: "Position", key: "position" },
  { label: "Team Lead", key: "team_lead" },
];

// liquidation fields
export const liquidationLeftFields = [
  { label: "Employee", key: "employee" },
  { label: "Department", key: "department" },
  { label: "Date of Liquidation", key: "created_date" },
];

export const liquidationRightFields = [
  { label: "Amount Obtained", key: "amount_obtained" },
  { label: "Amount Expended", key: "amount_expended" },
  { label: "Reimburse/Return", key: "reimburse_return" },
];

// cash request form
export const cashReqFields = [
  { label: "Employee", key: "employee" },
  { label: "Request Date", key: "request_date", type: "date" },
  { label: "Department", key: "department" },
  { label: "Team Lead", key: "team_lead" },
  { label: "Position", key: "position" },
];

// employee headers
export const expenseHeaders = [
  { header: "Employee", accessor: "employee" },
  { header: "Department", accessor: "department" },
  { header: "Description", accessor: "description" },
  { header: "Request Date", accessor: "expenseDate" },
  { header: "Total", accessor: "total" },
  { header: "Status", accessor: "status" },
];

export const employeeArchiveColumns = [...expenseHeaders];
export const employeeImportantColumns = [...expenseHeaders];
export const employeeTrashColumns = [...expenseHeaders];

// liquidation form
export const formFields = [
  [
    {
      controlId: "employee",
      label: "Employee",
      name: "employee",
      type: "text",
    },
    {
      controlId: "department",
      label: "Department",
      name: "department",
      type: "text",
    },
    {
      controlId: "created_date",
      label: "Date of Liquidation",
      name: "created_date",
      type: "date",
      max: new Date().toISOString().split("T")[0],
    },
  ],
  [
    {
      controlId: "amount_obtained",
      label: "Amount Obtained",
      name: "amount_obtained",
      type: "number",
      min: 0,
    },
    {
      controlId: "amount_expended",
      label: "Amount Expended",
      name: "amount_expended",
      type: "number",
      min: 0,
    },
    {
      controlId: "reimburse_return",
      label: "Reimburse/Return",
      name: "reimburse_return",
      type: "number",
      min: 0,
    },
  ],
];

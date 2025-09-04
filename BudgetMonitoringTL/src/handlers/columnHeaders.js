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
export const approvalFormFields = [
  { label: "Position", key: "cr_position" },
  { label: "Amount", key: "subtotal" },
];

export const approvalPartnerFields = [
  { label: "Employee", key: "cr_employee_id" },
  { label: "Expense Date", key: "cr_request_date" },
  { label: "Department", key: "department_name" },
  { label: "Team Lead", key: "cr_team_lead_id" },
];

// liquidation fields
export const liquidationLeftFields = [
  { label: "Employee", key: "employee" },
  { label: "Department", key: "department" },
  { label: "Date of Liquidation", key: "dateOfLiquidation" },
];

export const liquidationRightFields = [
  { label: "Amount Obtained", key: "amountObtained" },
  { label: "Amount Expended", key: "amountExpended" },
  { label: "Reimburse/Return", key: "reimburseOrReturn" },
];

// cash request form
export const cashReqFields = [
  { label: "Employee", key: "employee" },
  { label: "Request Date", key: "expenseDate", type: "date" },
  { label: "Department", key: "department" },
  { label: "Team Lead", key: "teamLead" },
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

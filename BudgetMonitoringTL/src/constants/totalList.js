export const EMPLOYEE_STATUS_LIST = [
  { label: "Pending Requests", key: "pending_requests", showPeso: false },
  { label: "Approved Requests", key: "approved_requests", showPeso: false },
  {
    label: "Pending Liquidations",
    key: "pending_liquidations",
    showPeso: false,
  },
  { label: "Remaining Balance", key: "wallet_balance" },
];

export const TEAMLEAD_STATUS_LIST = [
  { label: "Pending Requests", key: "pending_requests", showPeso: false },
  // { label: "Approved Requests", key: "approved_requests", showPeso: false },
  {
    label: "Pending Liquidations",
    key: "pending_liquidations",
    showPeso: false,
  },
  // {
  //   label: "Reviewed Liquidations",
  //   key: "approved_liquidations",
  //   showPeso: false,
  // },
];

export const FINANCE_STATUS_LIST = [
  { label: "Pending Requests", key: "pending_requests" },
  {
    label: "Released Vouchers",
    key: "released_vouchers_count",
    subKey: "released_vouchers_total",
  },
  {
    label: "Verified Liquidations",
    key: "verified_liquidations_count",
    subKey: "verified_liquidations_total",
  },
  { label: "Outstanding Balance", key: "outstanding_balance" },
];

export const BudgetOverview = [
  { label: "Liquidations to Validate", key: "liquidationsToValidate" },
  { label: "Validated Liquidations", key: "validatedLiquidations" },
  { label: "Total Liquidations Processed", key: "totalLiquidationsProcessed" },
];

export const BudgetAllocationOverview = [
  { label: "Total Budget", key: "totalBudget" },
  { label: "Budget Used", key: "budgetUsed" },
  { label: "Remaining Budget", key: "remainingBudget" },
];

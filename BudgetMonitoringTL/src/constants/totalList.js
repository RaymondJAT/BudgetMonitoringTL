export const EMPLOYEE_STATUS_LIST = [
  { label: "Pending Approval", key: "pending" },
  { label: "Awaiting Liquidation", key: "awaiting_liquidation" },
  { label: "For Reimbursement", key: "for_reimbursement" },
  { label: "Outstanding Balance", key: "outstanding_balance" },
];

export const TEAMLEAD_STATUS_LIST = [
  { label: "Requests to Approve", key: "pending" },
  { label: "Liquidations to Review", key: "liqToNote" },
  { label: "Approved Requests", key: "approvedRequest" },
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

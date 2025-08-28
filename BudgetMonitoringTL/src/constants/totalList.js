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
  { label: "Pending Fund Releases", key: "pending" },
  { label: "Liquidations to Verify", key: "approved" },
  { label: "Reimbursements to Process", key: "reimbursed" },
  { label: "Verified Transactions", key: "verified" },
  { label: "Total Funds Released", key: "total" },
];

export const BudgetOverview = [
  { label: "Total Budget", key: "totalBudget" },
  { label: "Budget Used", key: "budgetUsed" },
  { label: "Remaining Budget", key: "remainingBudget" },
  { label: "Total Department Funded", key: "totalRequest" },
  { label: "Total Liquidations", key: "totalLiquidations" },
  { label: "Final Approvals Needed", key: "finalApprovals" },
];

export const BudgetAllocationOverview = [
  { label: "Total Budget", key: "totalBudget" },
  { label: "Budget Used", key: "budgetUsed" },
  { label: "Remaining Budget", key: "remainingBudget" },
];

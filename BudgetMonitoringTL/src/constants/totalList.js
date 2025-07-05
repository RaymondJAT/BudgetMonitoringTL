export const EMPLOYEE_STATUS_LIST = [
  { label: "Pending Approval", key: "pending" },
  { label: "Approved Requests", key: "approved" },
  { label: "Awaiting Liquidation", key: "awaiting_liquidation" },
  { label: "Liquidation under Review", key: "liq_under_review" },
  { label: "For Reimbursement", key: "for_reimbursement" },
];

export const TEAMLEAD_STATUS_LIST = [
  { label: "To Approve", key: "pending" },
  { label: "Liquidation to Note", key: "liqToNote" },
  { label: "Approved Requests", key: "approvedRequest" },
];

export const FINANCE_STATUS_LIST = [
  { label: "Pending Fund Releases", key: "pending" },
  { label: "Liquidations to Check", key: "approved" },
  { label: "Reimbursements to Process", key: "reimbursed" },
  { label: "Verified Transactions", key: "verified" },
  { label: "Total Funds Released", key: "total" },
];

export const BudgetOverview = [
  { label: "Total Budget", key: "totalBudget" },
  { label: "Budget Used", key: "budgetUsed" },
  { label: "Remaining Budget", key: "remainingBudget" },
  { label: "Total Request", key: "totalRequest" },
  { label: "Total Liquidations", key: "totalLiquidations" },
  { label: "Final Approvals Needed", key: "finalApprovals" },
];

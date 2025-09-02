import { TbReport } from "react-icons/tb";
import {
  MdOutlineManageAccounts,
  MdOutlineSavings,
  MdOutlineDashboard,
  MdOutlineManageHistory,
} from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";

export const navConfig = {
  // FINANCE - (MASTERS)
  finance: [
    {
      label: "Dashboards",
      icon: MdOutlineDashboard,
      children: [
        { label: "Admin Dashboard", path: "/admin_dashboard" },
        { label: "Finance Dashboard", path: "/finance_dashboard" },
      ],
    },
    {
      label: "User Management",
      icon: MdOutlineManageAccounts,
      children: [
        { label: "Users", path: "/users" },
        { label: "Positions", path: "/positions" },
        { label: "Departments", path: "/departments" },
        { label: "Access", path: "/access" },
      ],
    },
    {
      label: "Fund Management",
      icon: MdOutlineSavings,
      children: [
        { label: "Budget Allocation", path: "/budget_allocation" },
        { label: "Revolving Fund", path: "/revolving_fund" },
        { label: "Cash Disbursement", path: "/cash_disbursement" },
        { label: "History", path: "/finance_history" },
      ],
    },
    {
      label: "Reports & Logs",
      icon: TbReport,
      children: [
        { label: "Budget Rerports", path: "/budget_report" },
        { label: "Audit Logs", path: "#" },
      ],
    },
    {
      label: "Cash Flow",
      icon: GiMoneyStack,
      children: [
        { label: "Pending Final Approval", path: "/final_approval" },
        { label: "All Requests", path: "/all_request" },
      ],
    },
    {
      label: "Cash Requests",
      icon: GiMoneyStack,
      children: [
        { label: "My Requests", path: "/employee_requests" },
        { label: "My Liquidations", path: "/employee_liquidation" },
        { label: "Pending Approvals", path: "/teamlead_pendings" },
        { label: "Approved Requests", path: "/my_approvals" },
        { label: "Rejected Requests", path: "/rejected_requests" },
        { label: "For Processing", path: "/finance_processing" },
        { label: "Released", path: "/finance_released" },
      ],
    },
    {
      label: "Liquidations",
      icon: GiMoneyStack,
      children: [
        { label: "To Verify", path: "/finance_verify" },
        { label: "Verified", path: "/finance_verified" },
        { label: "For Review", path: "/liquidation_review" },
        { label: "History", path: "/lead_history" },
      ],
    },
  ],
};

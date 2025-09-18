import { TbReport } from "react-icons/tb";
import {
  MdOutlineManageAccounts,
  MdOutlineSavings,
  MdOutlineDashboard,
} from "react-icons/md";
import { GiMoneyStack, GiExpense } from "react-icons/gi";

export const navConfig = [
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
  // {
  //   label: "Reports & Logs",
  //   icon: TbReport,
  //   children: [
  //     { label: "Budget Reports", path: "/budget_report" },
  //     { label: "Audit Logs", path: "#" },
  //   ],
  // },
  {
    label: "Cash Flow",
    icon: GiExpense,
    children: [
      { label: "Pending Final Approval", path: "/final_approval" },
      { label: "All Requests", path: "/all_request" },
    ],
  },
  {
    label: "Cash Requests",
    icon: GiMoneyStack,
    children: [
      { label: "My Requests", path: "/employee_request" },
      { label: "My Liquidations", path: "/employee_liquidation" },
      { label: "Pending Approvals", path: "/teamlead_pendings" },
      { label: "Approved Requests", path: "/my_approvals" },
      { label: "Rejected Requests", path: "/rejected_requests" },
      { label: "For Processing", path: "/finance_processing" },
      { label: "Released", path: "/finance_released" },
      { label: "Rejected", path: "/finance_rejected" },
    ],
  },
  {
    label: "Liquidations",
    icon: GiMoneyStack,
    children: [
      { label: "To Verify", path: "/finance_verify" },
      { label: "Verified", path: "/finance_verified" },
      { label: "For Review", path: "/liquidation_review" },
      { label: "Reviewed", path: "/liquidation_reviewed" },
      {
        label: "Rejected Liquidations",
        path: "/finance_rejected_liquidations",
      },
      { label: "Rejected", path: "/reject_liquidations" },
      // { label: "History", path: "/lead_history" },
    ],
  },
];

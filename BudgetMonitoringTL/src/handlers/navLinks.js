import { RxDashboard, RxTrash } from "react-icons/rx";
import { TbReport } from "react-icons/tb";
import {
  MdOutlineManageHistory,
  MdOutlineArchive,
  MdBookmarkBorder,
} from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";

export const navConfig = {
  // REQUESTER
  employee: [
    {
      label: "Cash Requests",
      icon: GiMoneyStack,
      children: [
        { label: "My Requests", path: "/" },
        { label: "My Liquidations", path: "/employee-liquidation" },
      ],
    },
    { label: "Archive", icon: MdOutlineArchive, path: "/employee-archive" },
    { label: "Important", icon: MdBookmarkBorder, path: "/employee-important" },
    { label: "Trash", icon: RxTrash, path: "/employee-trash" },
  ],

  // TEAM-LEADER
  teamlead: [
    {
      label: "Cash Requests",
      icon: GiMoneyStack,
      children: [
        { label: "Pending Approvals", path: "/" },
        { label: "Approved Requests", path: "/my-approvals" },
        { label: "Rejected Requests", path: "/rejected-requests" },
      ],
    },
    {
      label: "Liquidations",
      icon: GiMoneyStack,
      children: [
        { label: "For Review", path: "/liquidation-note" },
        { label: "History", path: "/lead-history" },
      ],
    },
    // { label: "Reports", icon: TbReport, path: "#" },
    { label: "Archive", icon: MdOutlineArchive, path: "/archive" },
    { label: "Important", icon: MdBookmarkBorder, path: "/important" },
    { label: "Trash", icon: RxTrash, path: "/trash" },
  ],

  // FINANCE
  finance: [
    { label: "Dashboard", icon: RxDashboard, path: "/" },
    {
      label: "Cash Requests",
      icon: GiMoneyStack,
      children: [
        { label: "For Processing", path: "/finance-processing" },
        { label: "Released", path: "/finance-released" },
      ],
    },
    {
      label: "Liquidations",
      icon: GiMoneyStack,
      children: [
        { label: "To Verify", path: "/finance-verify" },
        { label: "Verified", path: "/finance-verified" },
      ],
    },
    {
      label: "Management",
      icon: MdOutlineManageHistory,
      children: [
        { label: "Budget Allocation", path: "/budget-allocation" },
        { label: "Revolving Fund", path: "/revolving-fund" },
        { label: "Cash Disbursement", path: "/cash-disbursement" },
        { label: "History" },
        // { label: "User Management", path: "#" },
      ],
    },
    { label: "Archive", icon: MdOutlineArchive, path: "/finance-archive" },
    { label: "Important", icon: MdBookmarkBorder, path: "/finance-important" },
    { label: "Trash", icon: RxTrash, path: "/finance-trash" },
  ],

  // ADMIN
  admin: [
    { label: "Dashboard", icon: RxDashboard, path: "/" },
    {
      label: "Cash Flow",
      icon: GiMoneyStack,
      children: [
        { label: "Pending Final Approval", path: "/final-approval" },
        { label: "All Requests", path: "/all-request" },
      ],
    },
    {
      label: "Management",
      icon: MdOutlineManageHistory,
      children: [
        { label: "Budget Allocation", path: "/budget-allocation" },
        // { label: "User Management", path: "#" },
      ],
    },
    {
      label: "Reports & Logs",
      icon: TbReport,
      children: [
        { label: "Budget Rerports", path: "/budget-report" },
        { label: "Audit Logs", path: "#" },
      ],
    },
    { label: "Archive", icon: MdOutlineArchive, path: "/admin-archive" },
    { label: "Important", icon: MdBookmarkBorder, path: "/admin-important" },
    { label: "Trash", icon: RxTrash, path: "/admin-trash" },
  ],
};

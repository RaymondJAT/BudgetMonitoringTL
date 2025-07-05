import { RxDashboard, RxTrash } from "react-icons/rx";
import { TbReport } from "react-icons/tb";
import {
  MdOutlineManageHistory,
  MdOutlineArchive,
  MdBookmarkBorder,
} from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";

export const navConfig = {
  employee: [
    {
      label: "Expenses",
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

  teamlead: [
    {
      label: "Cash Requests",
      icon: GiMoneyStack,
      children: [
        { label: "Pending Approvals", path: "/" },
        { label: "My Approvals", path: "/my-approvals" },
        { label: "Rejected Requests", path: "/rejected-requests" },
      ],
    },
    {
      label: "Liquidations",
      icon: GiMoneyStack,
      children: [
        { label: "Liquidation to Note", path: "/liquidation-note" },
        { label: "History", path: "/lead-history" },
      ],
    },
    // { label: "Reports", icon: TbReport, path: "#" },
    { label: "Archive", icon: MdOutlineArchive, path: "/archive" },
    { label: "Important", icon: MdBookmarkBorder, path: "/important" },
    { label: "Trash", icon: RxTrash, path: "/trash" },
  ],

  admin: [
    { label: "Dashboard", icon: RxDashboard, path: "/" },
    {
      label: "Cash Flow",
      icon: GiMoneyStack,
      children: [
        { label: "All Requests", path: "#" },
        { label: "All Liquidations", path: "#" },
        { label: "Final Approvals", path: "#" },
      ],
    },
    {
      label: "Management",
      icon: MdOutlineManageHistory,
      children: [
        { label: "Budget Allocation", path: "#" },
        { label: "User Management", path: "#" },
      ],
    },
    {
      label: "Reports & Logs",
      icon: TbReport,
      children: [
        { label: "Rerports", path: "#" },
        { label: "Audit Logs", path: "#" },
      ],
    },
    { label: "Archive", icon: MdOutlineArchive, path: "#" },
    { label: "Important", icon: MdBookmarkBorder, path: "#" },
    { label: "Trash", icon: RxTrash, path: "#" },
  ],

  finance: [{ label: "Dashboard", icon: RxDashboard, path: "/" }],
};

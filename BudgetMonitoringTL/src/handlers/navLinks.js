import { FaMoneyBillWave, FaArchive, FaStar, FaTrash } from "react-icons/fa";

export const navConfig = {
  teamlead: [
    {
      label: "Expenses",
      icon: FaMoneyBillWave,
      children: [
        { label: "Approval Requests", path: "/" },
        { label: "My Approvals", path: "/my-approvals" },
        { label: "Rejected Requests", path: "/rejected-requests" },
      ],
    },
    { label: "Archive", icon: FaArchive, path: "/archive" },
    { label: "Important", icon: FaStar, path: "/important" },
    { label: "Trash", icon: FaTrash, path: "/trash" },
  ],

  employee: [
    {
      label: "Expenses",
      icon: FaMoneyBillWave,
      children: [{ label: "My Expenses", path: "/" }],
    },
    { label: "Archive", icon: FaArchive, path: "/employee-archive" },
    { label: "Important", icon: FaStar, path: "/employee-important" },
    { label: "Trash", icon: FaTrash, path: "/employee-trash" },
  ],
  admin: [
    {
      label: "Expenses",
      icon: FaMoneyBillWave,
      children: [{ label: "Dashboard", path: "/" }],
    },
  ],
};

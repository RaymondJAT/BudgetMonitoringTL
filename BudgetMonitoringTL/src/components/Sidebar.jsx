import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaArchive,
  FaStar,
  FaTrash,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { label: "Expenses", icon: <FaMoneyBillWave />, path: "#" },
    { label: "My Approval", icon: <FaCheckCircle />, path: "#" },
    { label: "Archive", icon: <FaArchive />, path: "#" },
    { label: "Important", icon: <FaStar />, path: "#" },
    { label: "Trash", icon: <FaTrash />, path: "#" },
  ];

  return (
    <div
      className={`sidebar d-flex flex-column vh-100 ${
        isSidebarOpen ? "py-2" : "py-2"
      } bg-light border-end ${isSidebarOpen ? "open" : "collapsed"}`}
    >
      <div className="sidebar-header px-3 py-2 d-flex align-items-center">
        <span className="nav-icon">
          <FaMoneyBillWave />
        </span>
        {isSidebarOpen && (
          <span className="nav-label ms-2 fw-bold">Expense Flow</span>
        )}
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nav-item"
            onClick={() => navigate(item.path)}
          >
            <span className="nav-icon">{item.icon}</span>
            {isSidebarOpen && <span className="nav-label">{item.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

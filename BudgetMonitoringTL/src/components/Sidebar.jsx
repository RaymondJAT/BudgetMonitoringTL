import React from "react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        ✖
      </button>
      <ul>
        <li>Dashboard</li>
        <li>Approvals</li>
        <li>Reports</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};
export default Sidebar;

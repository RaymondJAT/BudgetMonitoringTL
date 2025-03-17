import React from "react";

const Sidebar = ({ isSidebarOpen, toggleSidebar, onStatusChange }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "<<" : ">>"}
      </button>
      <div
        className={`sidebar-content ${isSidebarOpen ? "fade-in" : "fade-out"}`}
      >
        <div className="sidebar-header fw-bold">STATUS</div>
        <div className="status-filters">
          {["Pending", "Approved", "Refused", "In Payment"].map((status) => (
            <label key={status}>
              <input type="checkbox" onChange={() => onStatusChange(status)} />
              {status}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

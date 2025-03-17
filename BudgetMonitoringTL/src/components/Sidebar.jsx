import React, { useState } from "react";

const Sidebar = ({ isSidebarOpen, toggleSidebar, onStatusChange }) => {
  const [checkedStatuses, setCheckedStatuses] = useState([]);

  const handleCheckboxChange = (status) => {
    const updatedStatuses = checkedStatuses.includes(status)
      ? checkedStatuses.filter((s) => s !== status)
      : [...checkedStatuses, status];

    setCheckedStatuses(updatedStatuses);
    onStatusChange(status);
  };

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
            <label
              key={status}
              className={checkedStatuses.includes(status) ? "checked" : ""}
            >
              <input
                type="checkbox"
                checked={checkedStatuses.includes(status)}
                onChange={() => handleCheckboxChange(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

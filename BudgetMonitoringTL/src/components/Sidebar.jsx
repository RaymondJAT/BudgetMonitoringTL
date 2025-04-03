import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, toggleSidebar, onStatusChange }) => {
  const navigate = useNavigate();
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
        {/* Navigation Section */}
        <div className="navigation-links">
          <button className="nav-btn" onClick={() => navigate("/important")}>
            ⭐ Important
          </button>
          <button className="nav-btn" onClick={() => navigate("/archive")}>
            📦 Archive
          </button>
          <button className="nav-btn" onClick={() => navigate("/trash")}>
            🗑️ Trash
          </button>
        </div>

        {/* Status Filters */}
        <div className="sidebar-header fw-bold">STATUS</div>
        <div className="status-filters">
          {["Pending", "Refused"].map((status) => (
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

import React, { useState } from "react";

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  onStatusChange,
  onNavigate,
}) => {
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
        {/* <div className="sidebar-header fw-bold mt-2">NAVIGATION</div> */}
        <div className="navigation-links">
          <button className="nav-btn" onClick={() => onNavigate("important")}>
            ⭐ Important
          </button>
          <button className="nav-btn" onClick={() => onNavigate("archive")}>
            📁 Archive
          </button>
          <button className="nav-btn" onClick={() => onNavigate("important")}>
            🗑️ Trash
          </button>
        </div>

        {/* Status Filters */}
        <div className="sidebar-header fw-bold">STATUS</div>
        <div className="status-filters">
          {["Pending", "Approved", "Refused", "In Payment", "Paid"].map(
            (status) => (
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
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React from "react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "<<" : ">>"}
      </button>
      {isSidebarOpen && (
        <div className="sidebar-content">{/* side bar content */}</div>
      )}
    </div>
  );
};

export default Sidebar;

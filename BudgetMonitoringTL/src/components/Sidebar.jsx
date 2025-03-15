import React from "react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? "<<" : ">>"}
      </button>
      {isSidebarOpen && (
        <div className="sidebar-content">
          <h5>Sidebar Content</h5>
          <p>Additional options can go here.</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;

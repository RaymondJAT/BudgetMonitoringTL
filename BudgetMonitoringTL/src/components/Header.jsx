import React from "react";

const Header = ({ selectedRows, searchTerm, setSearchTerm, handlePrint }) => {
  return (
    <div className="teamlead-header">
      <div className="logo-text">ExpenseFlow</div>
      <div
        className={`button-group ${selectedRows.length > 0 ? "visible" : ""}`}
      >
        <button className="small-btn" onClick={handlePrint}>
          Print
        </button>
        <button className="small-btn">Actions</button>
      </div>

      {/* search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="custom-search-bar"
      />
    </div>
  );
};

export default Header;

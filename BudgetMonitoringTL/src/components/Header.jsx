import React from "react";
import { Dropdown } from "react-bootstrap";

const Header = ({
  selectedRows,
  searchTerm,
  setSearchTerm,
  handlePrint,
  handleDelete,
}) => {
  return (
    <div className="teamlead-header">
      <div className="logo-text">ExpenseFlow</div>
      <div
        className={`button-group ${selectedRows.length > 0 ? "visible" : ""}`}
      >
        {selectedRows.length === 1 && (
          <button className="small-btn" onClick={handlePrint}>
            Print
          </button>
        )}

        {selectedRows.length > 0 && (
          <Dropdown>
            <Dropdown.Toggle as="button" className="small-btn">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
              <Dropdown.Item>Archive</Dropdown.Item>
              <Dropdown.Item>Mark as Important</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="custom-search-bar"
      />
    </div>
  );
};

export default Header;

import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = ({
  selectedRows,
  searchTerm,
  setSearchTerm,
  handlePrint,
  handleDelete,
}) => {
  const navigate = useNavigate(); // Navigation hook

  const [selected, setSelected] = useState(() =>
    location.pathname === "/my-approvals" ? "My Approvals" : "Expenses"
  );

  return (
    <div className="teamlead-header">
      <div className="d-flex align-items-center gap-2">
        <div className="logo-text me-4">ExpenseFlow</div>

        <Dropdown>
          <Dropdown.Toggle
            as="button"
            className="small-btn"
            style={{ width: "111px" }}
          >
            {selected}
          </Dropdown.Toggle>
          <Dropdown.Menu className="custom-dropdown-menu">
            <Dropdown.Item onClick={() => navigate("/")}>
              Expenses
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/my-approvals")}>
              My Approvals
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div
        className={`button-group ${selectedRows?.length > 0 ? "visible" : ""}`}
      >
        {selectedRows?.length === 1 && (
          <button className="small-btn" onClick={handlePrint}>
            Print
          </button>
        )}

        {selectedRows?.length > 0 && (
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

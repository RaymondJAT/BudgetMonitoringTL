import React, { useState } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import {
  FiBarChart,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div
      className={`sidebar bg-light d-flex flex-column ${
        isSidebarOpen ? "open" : "closed"
      }`}
      style={{
        width: isSidebarOpen ? "225px" : "50px",
        transition: "width 0.3s",
      }}
    >
      <Button variant="light" className="m-2" onClick={toggleSidebar}>
        {isSidebarOpen ? "<<" : ">>"}
      </Button>
      {isSidebarOpen && (
        <Nav className="flex-column p-2">
          <Nav.Link href="#dashboard" className="d-flex align-items-center">
            <FiHome className="me-2" /> Dashboard
          </Nav.Link>
          <Nav.Link href="#sales" className="d-flex align-items-center">
            <FiDollarSign className="me-2" /> Sales
          </Nav.Link>
          <Nav.Link href="#viewsite" className="d-flex align-items-center">
            <FiMonitor className="me-2" /> View Site
          </Nav.Link>
          <Nav.Link href="#products" className="d-flex align-items-center">
            <FiShoppingCart className="me-2" /> Products
          </Nav.Link>
          <Nav.Link href="#tags" className="d-flex align-items-center">
            <FiTag className="me-2" /> Tags
          </Nav.Link>
          <Nav.Link href="#analytics" className="d-flex align-items-center">
            <FiBarChart className="me-2" /> Analytics
          </Nav.Link>
          <Nav.Link href="#members" className="d-flex align-items-center">
            <FiUsers className="me-2" /> Members
          </Nav.Link>
        </Nav>
      )}
    </div>
  );
};

export default Sidebar;

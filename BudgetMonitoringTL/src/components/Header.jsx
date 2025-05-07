import React from "react";
import { FaBars } from "react-icons/fa";
import { Container, Row, Col, Button } from "react-bootstrap";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header
      className="main-header shadow-sm"
      style={{
        marginLeft: isSidebarOpen ? "200px" : "60px",
        transition: "margin-left 0.3s ease",
        height: "60px",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container fluid>
        <Row className="align-items-center h-100">
          <Col xs="auto">
            <Button
              onClick={toggleSidebar}
              className="toggle-btn-header p-0"
              style={{
                fontSize: "1.5rem",
                color: "black",
                background: "none",
                border: "none",
              }}
            >
              <FaBars />
            </Button>
          </Col>
          <Col>
            <h5 className="mb-0">5L Solutions</h5>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;

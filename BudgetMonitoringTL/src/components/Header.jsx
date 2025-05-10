import React from "react";
import { FaBars, FaBell } from "react-icons/fa";
import { Container, Row, Col, Button, Image, Dropdown } from "react-bootstrap";
import avatarImg from "../assets/lcb.png";
import { FaUserCircle } from "react-icons/fa";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header
      className="main-header shadow-sm d-flex align-items-center"
      style={{
        marginLeft: isSidebarOpen ? "200px" : "60px",
        transition: "margin-left 0.3s ease",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        height: "60px",
      }}
    >
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="auto">
            <Button
              onClick={toggleSidebar}
              className="toggle-btn-header p-0"
              style={{
                fontSize: "1.2rem",
                color: "black",
                background: "none",
                border: "none",
              }}
            >
              <FaBars />
            </Button>
          </Col>
          {/* Middle Spacer */}
          <Col />

          <Col xs="auto">
            <div className="d-flex align-items-center gap-3">
              <FaBell
                style={{
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  marginRight: "15px",
                }}
              />
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  className="d-flex align-items-center gap-2 p-0 border-0 bg-transparent"
                  id="dropdown-user"
                >
                  <FaUserCircle
                    size={30}
                    style={{
                      borderRadius: "100%",
                      backgroundColor: "transparent",
                    }}
                  />
                  <span style={{ fontWeight: 400, fontSize: "13px" }}>
                    Username
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/settings">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#/logout">Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </Container>
    </header>
  );
};

export default Header;

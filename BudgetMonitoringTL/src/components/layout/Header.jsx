import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";

const Header = ({ toggleSidebar, isSidebarOpen, setUserRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const pageTitles = {
    "/": "Expenses",
    "/my-approvals": "Expenses",
    "/rejected-requests": "Expenses",
    "/archive": "Archive",
    "/important": "Importants",
    "/trash": "Trash",
  };

  const getPageTitle = () => {
    const path = location.pathname;
    return pageTitles[path] || "";
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    navigate("/login");
    window.location.reload();
  };

  const pageTitle = getPageTitle();

  return (
    <header
      className={`main-header shadow-sm d-flex align-items-center ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <Container fluid>
        <Row className="align-items-center">
          <Col xs="auto" className="d-flex align-items-center">
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
            <span
              className="page-title ms-2 fw-semibold"
              style={{
                fontSize: "1rem",
                whiteSpace: "nowrap",
                position: "relative",
                top: "3px",
                textTransform: "uppercase",
              }}
            >
              {pageTitle}
            </span>
          </Col>
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
                  <FaUserCircle size={30} />
                  <span style={{ fontWeight: 400, fontSize: "13px" }}>
                    {username}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#" style={{ fontSize: "0.75rem" }}>
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    style={{ fontSize: "0.75rem" }}
                  >
                    Logout
                  </Dropdown.Item>
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

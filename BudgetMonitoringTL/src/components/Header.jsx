import { useLocation } from "react-router-dom";
import { FaBars, FaBell } from "react-icons/fa";
import { Container, Row, Col, Button, Image, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (
      path === "/" ||
      path === "/my-approvals" ||
      path === "/rejected-requests"
    ) {
      return "Expenses";
    } else if (path === "/archive") {
      return "Archive";
    } else if (path === "/important") {
      return "Importants";
    } else if (path === "/trash") {
      return "Trash";
    } else {
      return "";
    }
  };

  const pageTitle = getPageTitle();
  return (
    <header
      className="main-header shadow-sm d-flex align-items-center"
      style={{
        marginLeft: isSidebarOpen ? "230px" : "60px",
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
                  <Dropdown.Item href="#">Settings</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href="#">Logout</Dropdown.Item>
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

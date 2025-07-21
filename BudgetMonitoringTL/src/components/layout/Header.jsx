import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { Container, Dropdown } from "react-bootstrap";
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
    "/employee-liquidation": "Expenses",
    "/employee-archive": "Archive",
    "/employee-important": "Importants",
    "/employee-trash": "Trash",
  };

  const getPageTitle = () => pageTitles[location.pathname] || "";

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setUserRole(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <header
      className={`main-header shadow-sm d-flex align-items-center px-3 ${
        isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
      style={{ height: "60px" }}
    >
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* Left: Sidebar Toggle & Page Title */}
          <div className="d-flex align-items-center">
            <button
              onClick={toggleSidebar}
              className="toggle-btn-header p-0 me-2 bg-transparent border-0 d-none d-md-block"
              style={{ fontSize: "1.2rem", color: "black" }}
            >
              <FaBars />
            </button>
            <span
              className="page-title fw-semibold text-uppercase"
              style={{
                fontSize: "1rem",
                position: "relative",
                top: "2px",
              }}
            >
              {getPageTitle()}
            </span>
          </div>

          {/* Right: Notification and User Menu */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            <FaBell
              style={{ fontSize: "1.2rem", cursor: "pointer" }}
              title="Notifications"
            />
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                className="d-flex align-items-center gap-2 p-0 border-0 bg-transparent"
                id="dropdown-user"
              >
                <FaUserCircle size={28} />
                {/* Hide username on small screens */}
                <span
                  className="d-none d-md-inline"
                  style={{ fontWeight: 400, fontSize: "13px" }}
                >
                  {username}
                </span>
                {/* Show dropdown arrow only on md and up */}
                <span className="d-none d-md-inline">▾</span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item style={{ fontSize: "0.75rem" }}>
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
        </div>
      </Container>
    </header>
  );
};

export default Header;

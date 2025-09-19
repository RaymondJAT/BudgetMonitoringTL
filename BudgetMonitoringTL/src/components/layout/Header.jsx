import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Dropdown } from "react-bootstrap";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";

const Header = ({
  toggleSidebar,
  isSidebarOpen,
  isSidebarHiddenMobile,
  onLogout,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerClass = isMobile
    ? isSidebarHiddenMobile
      ? "sidebar-hidden-mobile"
      : "sidebar-open"
    : isSidebarOpen
    ? "sidebar-open"
    : "sidebar-collapsed";

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
    onLogout(); // PARENT LOGOUT
    navigate("/login", { replace: true });
  };

  return (
    <header
      className={`main-header shadow-sm d-flex align-items-center px-3 ${headerClass}`}
      style={{ height: "60px" }}
    >
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center w-100">
          {/* SIDEBAR TOGGLE & PAGE TITLE */}
          <div className="d-flex align-items-center">
            <button
              onClick={toggleSidebar}
              className="p-0 me-2 bg-transparent border-0 d-inline d-md-none"
              style={{ fontSize: "1.2rem", color: "black" }}
            >
              <FaBars />
            </button>

            <button
              onClick={toggleSidebar}
              className="p-0 me-2 bg-transparent border-0 d-none d-md-inline"
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

          {/* NOTIF & USER MENU */}
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
                <span
                  className="d-none d-md-inline"
                  style={{ fontWeight: 400, fontSize: "13px" }}
                >
                  {username}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item
                  onClick={handleLogout}
                  className="dropdown-red-highlight"
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

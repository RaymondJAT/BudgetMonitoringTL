import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { navItems } from "../mock-data/navLinks";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const HeaderIcon = navItems[0].icon;

  return (
    <div
      className={`sidebar d-flex flex-column vh-100 py-2 bg-light border-end ${
        isSidebarOpen ? "open" : "collapsed"
      }`}
    >
      <div className="sidebar-header px-3 py-2 d-flex align-items-center">
        <span className="nav-icon">
          <HeaderIcon />
        </span>
        {isSidebarOpen && (
          <span className="nav-label ms-2 fw-bold">Expense Flow</span>
        )}
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <div key={item.label}>
            <div
              className="nav-item d-flex align-items-center px-3 py-2"
              onClick={() =>
                item.children ? toggleDropdown(item.label) : navigate(item.path)
              }
              style={{ cursor: "pointer" }}
            >
              <span className="nav-icon">{<item.icon />}</span>
              {isSidebarOpen && (
                <span className="nav-label ms-2">{item.label}</span>
              )}
            </div>

            {item.children && openDropdown === item.label && isSidebarOpen && (
              <div className="dropdown-links ps-5">
                {item.children.map((child) => (
                  <div
                    key={child.label}
                    className="nav-item py-1"
                    onClick={() => navigate(child.path)}
                    style={{ cursor: "pointer" }}
                  >
                    {child.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

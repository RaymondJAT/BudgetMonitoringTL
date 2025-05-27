import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { navItems } from "../../handlers/navLinks";

const Sidebar = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setDropdownPosition({ top: rect.top, left: rect.right + 4 });
    setOpenDropdown(openDropdown === label ? null : label);
  };

  // close dropdowns when sidebar is collapsed
  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenDropdown(null);
    }
  }, [isSidebarOpen]);

  // close floating dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const HeaderIcon = navItems[0].icon;

  return (
    <div
      ref={sidebarRef}
      className={`sidebar d-flex flex-column vh-100 py-2 bg-light border-end ${
        isSidebarOpen ? "open" : "collapsed"
      }`}
    >
      {!isSidebarOpen && openDropdown && (
        <div
          ref={dropdownRef}
          className="floating-dropdown bg-white border shadow-sm"
          style={{
            position: "fixed",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            zIndex: 9999,
            minWidth: "150px",
          }}
        >
          {navItems
            .find((item) => item.label === openDropdown)
            ?.children.map((child) => (
              <div
                key={child.label}
                className="dropdown-item px-3 py-2"
                onClick={() => {
                  navigate(child.path);
                  setOpenDropdown(null);
                }}
                style={{ cursor: "pointer" }}
              >
                {child.label}
              </div>
            ))}
        </div>
      )}

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
              className="nav-item d-flex align-items-center justify-content-between px-3 py-2"
              onClick={(e) =>
                item.children
                  ? toggleDropdown(e, item.label)
                  : navigate(item.path)
              }
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center">
                <span className="nav-icon">{<item.icon />}</span>
                {isSidebarOpen && (
                  <span className="nav-label ms-2 d-flex align-items-center gap-3">
                    {item.label}
                    {item.children && (
                      <span className="dropdown-arrow">
                        {openDropdown === item.label ? "▾" : "▸"}
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>

            {item.children && isSidebarOpen && (
              <div
                className={`dropdown-links ps-5 transition-container ${
                  openDropdown === item.label ? "open" : ""
                }`}
              >
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

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navConfig } from "../../handlers/navLinks";
import { FaMoneyBillWave } from "react-icons/fa";
import { hasAccess } from "../../utils/accessControl";

const Sidebar = ({ isSidebarOpen, isSidebarHiddenMobile, userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState(isSidebarOpen ? [] : null);
  const [dropdownPositions, setDropdownPositions] = useState({});

  const navItems = navConfig[userRole] || [];

  // ✅ get allowed routes from localStorage
  const allowedRoutes = JSON.parse(localStorage.getItem("access") || "[]");

  // ✅ filter nav items based on access
  const filteredNavItems = navItems
    .map((item) => {
      // filter children if exist
      if (item.children) {
        const children = item.children.filter((child) =>
          hasAccess(child.path, allowedRoutes)
        );
        if (children.length === 0) return null; // skip parent if no accessible children
        return { ...item, children };
      }
      return hasAccess(item.path, allowedRoutes) ? item : null;
    })
    .filter(Boolean); // remove nulls

  const toggleDropdown = (e, label) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isMobileView = window.innerWidth <= 576;

    setDropdownPositions((prev) => ({
      ...prev,
      [label]: { top: rect.top, left: rect.right + 4 },
    }));

    if (isSidebarOpen) {
      setOpenDropdown((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    } else {
      setOpenDropdown((prev) =>
        isMobileView && prev === label ? null : label
      );
    }
  };

  useEffect(() => {
    setOpenDropdown(isSidebarOpen ? [] : null);
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setOpenDropdown(isSidebarOpen ? [] : null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar d-flex flex-column vh-100 py-2 border-end 
        ${isSidebarHiddenMobile ? "d-none d-sm-flex sidebar-hidden" : ""} 
        ${isSidebarOpen ? "open" : "collapsed"}`}
    >
      {/* FLOATING DROPDOWN */}
      {!isSidebarOpen &&
        openDropdown &&
        (() => {
          const item = filteredNavItems.find((i) => i.label === openDropdown);
          const position = dropdownPositions[openDropdown];
          if (!item || !item.children || !position) return null;

          return (
            <div
              ref={dropdownRef}
              className="floating-dropdown bg-white border shadow-sm"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                zIndex: 9999,
                minWidth: "150px",
              }}
            >
              {item.children.map((child) => (
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
          );
        })()}

      {/* SIDEBAR HEADER */}
      <div className="sidebar-header d-flex align-items-center justify-content-center">
        <FaMoneyBillWave
          style={{
            fontSize: isSidebarOpen ? "1.5rem" : "1.3rem",
            color: "#800000",
            transition: "font-size 0.3s ease",
          }}
        />
        {isSidebarOpen && <span className="nav-label ms-2 fw-bold">BMS</span>}
      </div>

      {/* NAV ITEMS */}
      <div className="cashreq-scroll nav-links flex-grow-1 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <div key={item.label}>
            <div
              className={`nav-item d-flex align-items-center justify-content-between px-3 py-2 ${
                location.pathname === item.path ? "active-nav" : ""
              }`}
              onClick={(e) => {
                if (item.children) toggleDropdown(e, item.label);
                else navigate(item.path);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex align-items-center w-100">
                <span className="nav-icon">{<item.icon />}</span>
                {isSidebarOpen && (
                  <>
                    <span className="nav-label ms-2 flex-grow-1">
                      {item.label}
                    </span>
                    {item.children && (
                      <span className="dropdown-arrow">
                        {(Array.isArray(openDropdown) &&
                          openDropdown.includes(item.label)) ||
                        openDropdown === item.label
                          ? "▾"
                          : "▸"}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {item.children && isSidebarOpen && (
              <div
                className={`dropdown-wrapper ms-4 me-3 ${
                  Array.isArray(openDropdown) &&
                  openDropdown.includes(item.label)
                    ? "open"
                    : ""
                }`}
              >
                <div className="dropdown-box my-2 p-2 rounded shadow-sm bg-white border">
                  {item.children.map((child) => (
                    <div
                      key={child.label}
                      className={`dropmenu-item py-1 px-2 rounded hover-bg ${
                        location.pathname === child.path ? "active-nav" : ""
                      }`}
                      onClick={() => navigate(child.path)}
                      style={{ cursor: "pointer" }}
                    >
                      {child.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

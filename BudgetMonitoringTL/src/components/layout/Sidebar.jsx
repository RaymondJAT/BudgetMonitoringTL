import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { navConfig } from "../../handlers/navLinks";
import { FaMoneyBillWave } from "react-icons/fa";
import { hasAccess } from "../../utils/accessControl";

const Sidebar = ({ isSidebarOpen, isSidebarHiddenMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  const [openDropdown, setOpenDropdown] = useState([]);
  const [dropdownPositions, setDropdownPositions] = useState({});

  const filteredNavItems = navConfig
    .map((item) => {
      if (item.children) {
        const children = item.children.filter((child) => hasAccess(child.path));
        if (!children.length) return null;
        return { ...item, children };
      }
      return hasAccess(item.path) ? item : null;
    })
    .filter(Boolean);

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
          ? prev.filter((l) => l !== label)
          : [...prev, label]
      );
    } else {
      setOpenDropdown((prev) => (prev === label ? null : label));
    }
  };

  useEffect(() => {
    setOpenDropdown([]);
  }, [isSidebarOpen]);

  // SIDEBAR COLLAPSE CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isSidebarOpen) {
        if (
          sidebarRef.current &&
          !sidebarRef.current.contains(e.target) &&
          dropdownRef.current &&
          !dropdownRef.current.contains(e.target)
        ) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  return (
    <div
      ref={sidebarRef}
      className={`sidebar d-flex flex-column vh-100 py-2 border-end ${
        isSidebarHiddenMobile ? "d-none d-sm-flex sidebar-hidden" : ""
      } ${isSidebarOpen ? "open" : "collapsed"}`}
    >
      {/* HEADER */}
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

      {/* NAVIGATION */}
      <div className="cashreq-scroll nav-links flex-grow-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isOpen = Array.isArray(openDropdown)
            ? openDropdown.includes(item.label)
            : openDropdown === item.label;

          return (
            <div key={item.label} className="position-relative">
              {/* NAV ITEM */}
              <div
                className={`nav-item d-flex align-items-center justify-content-between px-3 py-2 ${
                  location.pathname === item.path ? "active-nav" : ""
                }`}
                onClick={(e) =>
                  item.children
                    ? toggleDropdown(e, item.label)
                    : navigate(item.path)
                }
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
                          {isOpen ? "▾" : "▸"}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* DROPDOWN MENU */}
              {item.children && (
                <div
                  ref={dropdownRef}
                  className={`dropdown-wrapper ${
                    isSidebarOpen ? "ms-4 me-3" : "position-fixed"
                  } ${isOpen ? "open" : ""}`}
                  style={
                    !isSidebarOpen
                      ? {
                          top: dropdownPositions[item.label]?.top,
                          left: dropdownPositions[item.label]?.left,
                          zIndex: 1000,
                          minWidth: 150,
                        }
                      : {}
                  }
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
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

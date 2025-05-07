import React from "react";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="main-header d-flex align-items-center">
      <button className="toggle-btn-header" onClick={toggleSidebar}>
        <FaBars />
      </button>
      {/* Other header content here */}
    </header>
  );
};

export default Header;

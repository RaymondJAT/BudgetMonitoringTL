import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Routing from "./routes/Routing";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHiddenMobile, setIsSidebarHiddenMobile] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userRole = localStorage.getItem("role") || "finance";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen((prev) => !prev);
      setIsSidebarHiddenMobile((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private */}
        <Route
          path="/*"
          element={
            <>
              <Header
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
                isSidebarHiddenMobile={isSidebarHiddenMobile}
              />
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                isSidebarHiddenMobile={isSidebarHiddenMobile}
                userRole={userRole}
              />
              <main
                style={{
                  transition: "margin-left 0.3s ease",
                  marginLeft: isMobile
                    ? isMobileSidebarOpen
                      ? "70px"
                      : "0"
                    : isSidebarOpen
                    ? "230px"
                    : "70px",
                }}
              >
                <ToastContainer position="top-right" autoClose={1000} />
                <Routing />
              </main>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

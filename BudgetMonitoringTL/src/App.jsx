import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Swal from "sweetalert2";

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

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  // login
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // logout
  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
  };

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

  useEffect(() => {
    if (!sessionStorage.getItem("sessionActive")) {
      localStorage.clear();
      setIsAuthenticated(false);
      sessionStorage.setItem("sessionActive", "true");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    let logoutTimer;

    const resetTimer = () => {
      clearTimeout(logoutTimer);
      logoutTimer = setTimeout(() => {
        Swal.fire({
          title: "Session Expired",
          text: "You have been logged out due to inactivity.",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          logout();
        }, 2000);
      }, 30 * 60 * 1000);
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(logoutTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            isAuthenticated && localStorage.getItem("firstRoute") ? (
              <Navigate to={localStorage.getItem("firstRoute")} replace />
            ) : (
              <Login onLogin={login} />
            )
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <>
                <Header
                  toggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                  isSidebarHiddenMobile={isSidebarHiddenMobile}
                  onLogout={logout}
                />
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  isSidebarHiddenMobile={isSidebarHiddenMobile}
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
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

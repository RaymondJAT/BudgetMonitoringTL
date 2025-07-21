import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Login from "./pages/Login";

// Role-based routes
import TeamLeadRoutes from "./routes/TeamLeadRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import EmployeeRoutes from "./routes/EmployeeRoutes";
import FinanceRoutes from "./routes/FinanceRoutes";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const handleResize = () => {
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

  const renderRoutes = () => {
    switch (userRole) {
      case "employee":
        return <EmployeeRoutes />;
      case "admin":
        return <AdminRoutes />;
      case "teamlead":
        return <TeamLeadRoutes />;
      case "finance":
        return <FinanceRoutes />;
      default:
        return <Login setUserRole={setUserRole} />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setUserRole={setUserRole} />} />

        {!userRole ? (
          <Route path="*" element={<Login setUserRole={setUserRole} />} />
        ) : (
          <>
            <Route
              path="/*"
              element={
                <>
                  <Header
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                    setUserRole={setUserRole}
                  />
                  <Sidebar isSidebarOpen={isSidebarOpen} userRole={userRole} />
                  <main
                    style={{ marginLeft: isSidebarOpen ? "230px" : "60px" }}
                  >
                    <ToastContainer position="top-right" autoClose={1000} />
                    {renderRoutes()}
                  </main>
                </>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;

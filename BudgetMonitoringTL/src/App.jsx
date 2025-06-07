import { useState } from "react";
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
// import AdminRoutes from "./routes/AdminRoutes";
// import EmployeeRoutes from "./routes/EmployeeRoutes";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  const renderRoutes = () => {
    switch (userRole) {
      case "employee":
        return <EmployeeRoutes />;
      case "admin":
        return <AdminRoutes />;
      case "teamlead":
      default:
        return <TeamLeadRoutes />;
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
                  <Sidebar isSidebarOpen={isSidebarOpen} />
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

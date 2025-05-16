import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Expenses from "./pages/Expenses";
import ApprovalForm from "./components/ApprovalForm";
import Approval from "./pages/Approval";
import Reject from "./pages/Reject";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <Header
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <main
        style={{
          marginLeft: isSidebarOpen ? "230px" : "60px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <Routes>
          <Route path="/approval-requests" element={<Expenses />} />
          <Route path="/my-approvals" element={<Approval />} />
          <Route path="/rejected-requests" element={<Reject />} />
          <Route path="/approval-form" element={<ApprovalForm />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;

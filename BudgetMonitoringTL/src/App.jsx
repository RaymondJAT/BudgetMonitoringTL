import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ApprovalForm from "./components/ApprovalForm";
import Expenses from "./pages/Expenses";
import Approval from "./pages/Approval";
import Trash from "./pages/Trash";
import { TrashProvider } from "./context/TrashContext";

function App() {
  return (
    <TrashProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Expenses />} />
          <Route path="/approval" element={<ApprovalForm />} />
          <Route path="/my-approvals" element={<Approval />} />
          <Route path="/trash" element={<Trash />} />
        </Routes>
      </Router>
    </TrashProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ApprovalForm from "./components/ApprovalForm";
import Expenses from "./pages/Expenses";
import Approval from "./pages/Approval";
import Trash from "./pages/Trash";
import { TrashProvider } from "./context/TrashContext";
import Archive from "./pages/Archive";
import Important from "./pages/Important";

function App() {
  return (
    <TrashProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Expenses />} />
          <Route path="/approval" element={<ApprovalForm />} />
          <Route path="/my-approvals" element={<Approval />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/important" element={<Important />} />
        </Routes>
      </Router>
    </TrashProvider>
  );
}

export default App;

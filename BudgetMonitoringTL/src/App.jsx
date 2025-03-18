import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import ApprovalForm from "./components/ApprovalForm";
import TeamLead from "./pages/TeamLead";
import Sample from "./components/Sample";
import PrintableCashRequest from "./components/PrintableCashRequest";

function App() {
  return (
    <>
      {/* <Router>
        <Routes>
          <Route path="/" element={<TeamLead />} />
          <Route path="/approval" element={<ApprovalForm />} />
        </Routes>
      </Router> */}

      <PrintableCashRequest />
      <Sample />
    </>
  );
}

export default App;

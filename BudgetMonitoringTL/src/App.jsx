import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Expenses from "./pages/Expenses";
import ExpenseReport from "./components/ExpenseReport";
import Total from "./components/Total";

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
          marginLeft: isSidebarOpen ? "200px" : "60px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        {/* main content */}
        <Total />
        {/* <ExpenseReport /> */}
        <Expenses />
      </main>
    </Router>
  );
};

export default App;

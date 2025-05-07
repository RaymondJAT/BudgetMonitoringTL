import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

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
        }}
      >
        {/* Your main content goes here */}
      </main>
    </Router>
  );
};

export default App;

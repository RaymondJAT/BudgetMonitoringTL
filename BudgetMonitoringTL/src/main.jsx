import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ backgroundColor: "#800000", minHeight: "100vh" }}>
      <App />
    </div>
  </StrictMode>
);

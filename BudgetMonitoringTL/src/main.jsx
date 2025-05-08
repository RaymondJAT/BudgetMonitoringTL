import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div style={{ backgroundColor: "#F5F5DC" }}>
      <App />
    </div>
  </StrictMode>
);

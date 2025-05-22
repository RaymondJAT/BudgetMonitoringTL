import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TotalProvider } from "./context/TotalContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TotalProvider>
      <div style={{ backgroundColor: "#800000", minHeight: "100vh" }}>
        <App />
      </div>
    </TotalProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, #800000,rgb(64, 31, 31))",
        minHeight: "100vh",
      }}
    >
      <App />
    </div>
  </StrictMode>
);

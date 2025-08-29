import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import for React 18
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root")); // ✅ Correct way
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring (optional)
reportWebVitals();

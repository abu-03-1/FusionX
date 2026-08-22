import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./dayflow.css";
import "./index.css";
import "./App.css";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
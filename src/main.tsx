import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { APIKeyProvider } from "./context/APIKeyContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <APIKeyProvider>
      <App />
    </APIKeyProvider>
  </React.StrictMode>
);

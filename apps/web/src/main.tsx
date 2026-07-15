import React from "react";
import ReactDOM from "react-dom/client";
import { AppRouter } from "./app/router";
import { AppProviders } from "./providers/app-providers";
import "./app/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </React.StrictMode>,
);

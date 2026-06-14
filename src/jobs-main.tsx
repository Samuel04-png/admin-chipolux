import React from "react";
import ReactDOM from "react-dom/client";
import JobsPage from "./JobsPage";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("jobs-root")!).render(
  <React.StrictMode>
    <JobsPage />
  </React.StrictMode>,
);

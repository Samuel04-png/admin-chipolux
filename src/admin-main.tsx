import React from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./admin/AdminApp";
import "./admin/admin.css";

document.body.classList.add("admin-body");

ReactDOM.createRoot(document.getElementById("admin-root")!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>,
);

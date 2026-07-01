import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./index.css";

import App from "./App";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/ai">
      <Routes>
        <Route index element={<App />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="chat" element={<Chat />} />
        <Route path="documents" element={<Documents />} />
        <Route path="search" element={<Search />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
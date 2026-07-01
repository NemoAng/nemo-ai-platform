import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

import { Dashboard } from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Documents from "./pages/Documents";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar />

        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
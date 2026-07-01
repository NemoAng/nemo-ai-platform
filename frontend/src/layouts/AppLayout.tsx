import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}
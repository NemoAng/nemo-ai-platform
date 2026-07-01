import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">◉</div>
        <div>
          <div className="brand-title">Nemo AI</div>
          <div className="brand-subtitle">Platform</div>
        </div>
      </div>

      <nav>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/chat">AI Chat</NavLink>
        <NavLink to="/documents">Documents</NavLink>
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}
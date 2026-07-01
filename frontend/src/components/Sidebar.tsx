import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "AI Chat", path: "/chat" },
  { label: "Documents", path: "/documents" },
  { label: "Search", path: "/search" },
  { label: "Settings", path: "/settings" },
];

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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
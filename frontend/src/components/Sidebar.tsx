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
        <a className="active">Dashboard</a>
        <a>AI Chat</a>
        <a>Documents</a>
        <a>Search</a>
        <a>Models</a>
        <a>Agents</a>
        <a>Nemo VOD</a>
        <a>Settings</a>
      </nav>
    </aside>
  );
}

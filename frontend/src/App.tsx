import { useEffect, useState } from "react";
import "./App.css";

type Health = {
  status: string;
  service: string;
  database?: string;
};

function App() {
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/ai-api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(setHealth)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main>
      <h1>Nemo AI Platform</h1>
      <p>Self-hosted AI platform for RAG, documents, media, and agents.</p>

      <section>
        <h2>Backend Health</h2>
        {health && <pre>{JSON.stringify(health, null, 2)}</pre>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!health && !error && <p>Loading...</p>}
      </section>
    </main>
  );
}

export default App;

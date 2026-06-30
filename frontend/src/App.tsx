import { useEffect, useState } from "react";
import "./App.css";

type BackendHealth = {
  status: string;
  service: string;
  database?: string;
};

type ProviderHealth = {
  provider: string;
  chat: { ok: boolean; error: string | null };
  embedding: { ok: boolean; error: string | null };
};

type VectorHealth = {
  vector_store: string;
  status: string;
  heartbeat?: number;
};

type AskResult = {
  question: string;
  answer: string;
  provider: string;
  sources: {
    source_number: number;
    document_id: number;
    chunk_id: number;
    chunk_index: number;
    distance: number;
    content_preview: string;
  }[];
};

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={ok ? "dot ok" : "dot bad"} />;
}

function App() {
  const [backend, setBackend] = useState<BackendHealth | null>(null);
  const [provider, setProvider] = useState<ProviderHealth | null>(null);
  const [vector, setVector] = useState<VectorHealth | null>(null);

  const [title, setTitle] = useState("RAG Demo");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResult | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/ai-api/health").then(r => r.json()).then(setBackend);
    fetch("/ai-api/ai/provider/health").then(r => r.json()).then(setProvider);
    fetch("/ai-api/vector/health").then(r => r.json()).then(setVector);
  }, []);

  async function addDocument() {
    setStatus("Saving and indexing document...");

    const res = await fetch("/ai-api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, source_type: "text" }),
    });

    if (!res.ok) {
      setStatus(`Document error: HTTP ${res.status}`);
      return;
    }

    const data = await res.json();
    setStatus(`Document saved and indexed. ID: ${data.id}`);
  }

  async function askAI() {
    setStatus("Asking AI...");

    const res = await fetch(
      `/ai-api/ask?q=${encodeURIComponent(question)}&top_k=3`
    );

    if (!res.ok) {
      setStatus(`Ask error: HTTP ${res.status}`);
      return;
    }

    const data = await res.json();
    setAnswer(data);
    setStatus("Answer received.");
  }

  return (
    <div className="app-shell">
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

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Nemo AI Platform</h1>
            <p>Self-hosted AI workspace for documents, RAG, media, and agents.</p>
          </div>
          <div className="user-pill">Nemo Wang</div>
        </header>

        <section className="grid cards">
          <div className="card">
            <div className="card-label">Backend</div>
            <h2><StatusDot ok={backend?.status === "ok"} /> FastAPI</h2>
            <p>{backend?.database ? `Database: ${backend.database}` : "Loading..."}</p>
          </div>

          <div className="card">
            <div className="card-label">AI Provider</div>
            <h2><StatusDot ok={!!provider?.chat.ok} /> {provider?.provider || "Loading"}</h2>
            <p>Chat: {provider?.chat.ok ? "Online" : "Checking"} · Embedding: {provider?.embedding.ok ? "Online" : "Checking"}</p>
          </div>

          <div className="card">
            <div className="card-label">Vector Store</div>
            <h2><StatusDot ok={vector?.status === "ok"} /> {vector?.vector_store || "ChromaDB"}</h2>
            <p>{vector?.heartbeat ? `Heartbeat: ${vector.heartbeat}` : "Loading..."}</p>
          </div>
        </section>

        <section className="workspace">
          <div className="panel">
            <div className="panel-header">
              <h2>Add Document</h2>
              <span>Auto chunk + embed + index</span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document title"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste document content here..."
              rows={10}
            />

            <button onClick={addDocument}>Save & Index</button>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Ask AI</h2>
              <span>RAG with cited chunks</span>
            </div>

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your documents..."
            />

            <button onClick={askAI}>Ask Nemo AI</button>

            {status && <div className="status">{status}</div>}

            {answer && (
              <div className="answer-box">
                <div className="message user">
                  <strong>You</strong>
                  <p>{answer.question}</p>
                </div>

                <div className="message ai">
                  <strong>Nemo AI · {answer.provider}</strong>
                  <p>{answer.answer}</p>
                </div>

                <div className="sources">
                  <h3>Sources</h3>
                  {answer.sources.map((s) => (
                    <div className="source" key={`${s.document_id}-${s.chunk_id}`}>
                      <div>
                        Source {s.source_number} · Document {s.document_id} · Chunk {s.chunk_index}
                      </div>
                      <p>{s.content_preview}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

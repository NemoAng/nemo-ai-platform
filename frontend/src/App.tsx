import { useEffect, useState } from "react";
import "./App.css";

type Health = {
  status: string;
  service: string;
  database?: string;
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

function App() {
  const [health, setHealth] = useState<Health | null>(null);

  const [title, setTitle] = useState("RAG Demo");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResult | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/ai-api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setStatus(`Health error: ${err.message}`));
  }, []);

  async function addDocument() {
    setStatus("Saving and indexing document...");

    const res = await fetch("/ai-api/documents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        source_type: "text",
      }),
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
    <main>
      <h1>Nemo AI Platform</h1>
      <p>Self-hosted AI platform for RAG, documents, media, and agents.</p>

      <section>
        <h2>Backend Health</h2>
        <pre>{health ? JSON.stringify(health, null, 2) : "Loading..."}</pre>
      </section>

      <section>
        <h2>Add Document</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste document content here..."
          rows={8}
        />
        <button onClick={addDocument}>Save & Index</button>
      </section>

      <section>
        <h2>Ask AI</h2>
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={askAI}>Ask</button>
      </section>

      {status && <p>{status}</p>}

      {answer && (
        <section>
          <h2>Answer</h2>
          <p className="answer">{answer.answer}</p>

          <h3>Sources</h3>
          <pre>{JSON.stringify(answer.sources, null, 2)}</pre>
        </section>
      )}
    </main>
  );
}

export default App;

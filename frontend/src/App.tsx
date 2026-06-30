import { useEffect, useState } from "react";
import "./App.css";

import { AskPanel } from "./components/AskPanel";
import { DocumentPanel } from "./components/DocumentPanel";
import { HealthCards } from "./components/HealthCards";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

import type {
  AskResult,
  BackendHealth,
  ProviderHealth,
  VectorHealth,
} from "./types/api";

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
    fetch("/ai-api/health").then((r) => r.json()).then(setBackend);
    fetch("/ai-api/ai/provider/health").then((r) => r.json()).then(setProvider);
    fetch("/ai-api/vector/health").then((r) => r.json()).then(setVector);
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
    <div className="app-shell">
      <Sidebar />

      <main className="main">
        <Topbar />

        <HealthCards backend={backend} provider={provider} vector={vector} />

        <section className="workspace">
          <DocumentPanel
            title={title}
            content={content}
            onTitleChange={setTitle}
            onContentChange={setContent}
            onSave={addDocument}
          />

          <AskPanel
            question={question}
            answer={answer}
            status={status}
            onQuestionChange={setQuestion}
            onAsk={askAI}
          />
        </section>
      </main>
    </div>
  );
}

export default App;

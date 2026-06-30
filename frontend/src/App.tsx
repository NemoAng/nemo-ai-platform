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

import {
  askAI as askAIRequest,
  createDocument,
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "./services/api";

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
    getBackendHealth().then(setBackend);
    getProviderHealth().then(setProvider);
    getVectorHealth().then(setVector);
  }, []);

  async function addDocument() {
    setStatus("Saving and indexing document...");

    try {
      const data = await createDocument(title, content);
      setStatus(`Document saved and indexed. ID: ${data.id}`);
    } catch (err) {
      setStatus(`Document error: ${(err as Error).message}`);
    }
  }

  async function askAI() {
    setStatus("Asking AI...");

    try {
      const data = await askAIRequest(question, 3);
      setAnswer(data);
      setStatus("Answer received.");
    } catch (err) {
      setStatus(`Ask error: ${(err as Error).message}`);
    }
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

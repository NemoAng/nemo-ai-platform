import { useEffect, useState } from "react";
import "./App.css";

import { askAI as askAIRequest } from "./services/ai";
import { createDocument, listDocuments } from "./services/document";
import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "./services/health";

import { Dashboard } from "./pages/Dashboard";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";

import type {
  AskResult,
  BackendHealth,
  DocumentItem,
  ProviderHealth,
  VectorHealth,
} from "./types/api";

export default function App() {
  const [backend, setBackend] = useState<BackendHealth | null>(null);
  const [provider, setProvider] = useState<ProviderHealth | null>(null);
  const [vector, setVector] = useState<VectorHealth | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  const [title, setTitle] = useState("RAG Demo");
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResult | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getBackendHealth().then(setBackend);
    getProviderHealth().then(setProvider);
    getVectorHealth().then(setVector);
    listDocuments().then(setDocuments);
  }, []);

  async function addDocument() {
    setStatus("Saving and indexing document...");

    try {
      const data = await createDocument(title, content);
      setStatus(`Document saved and indexed. ID: ${data.id}`);

      const docs = await listDocuments();
      setDocuments(docs);
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

        <Dashboard
          backend={backend}
          provider={provider}
          vector={vector}
          documents={documents}
          title={title}
          content={content}
          question={question}
          answer={answer}
          status={status}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onQuestionChange={setQuestion}
          onSaveDocument={addDocument}
          onAskAI={askAI}
        />
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import "./App.css";

import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { Dashboard } from "./pages/Dashboard";

import type {
  AskResult,
  BackendHealth,
  ProviderHealth,
  VectorHealth,
} from "./types/api";

import { askAI as askAIRequest } from "./services/ai";
import { createDocument } from "./services/document";
import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "./services/health";

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

		<Dashboard
		  backend={backend}
		  provider={provider}
		  vector={vector}
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

export default App;

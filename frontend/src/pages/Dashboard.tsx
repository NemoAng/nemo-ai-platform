import { useEffect, useState } from "react";

import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "../services/health";
import { listDocuments } from "../services/document";

import type {
  BackendHealth,
  ProviderHealth,
  VectorHealth,
  DocumentItem,
} from "../types/api";

export function Dashboard() {
  const [backend, setBackend] = useState<BackendHealth | null>(null);
  const [provider, setProvider] = useState<ProviderHealth | null>(null);
  const [vector, setVector] = useState<VectorHealth | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  // 🔥 实时刷新（每 5 秒）
  useEffect(() => {
    const load = () => {
      getBackendHealth().then(setBackend);
      getProviderHealth().then(setProvider);
      getVectorHealth().then(setVector);
      listDocuments().then(setDocuments);
    };

    load();
    const timer = setInterval(load, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="page">
      <div className="card-grid">
        {/* Backend */}
        <div className="card">
          <div className="card-title">Backend</div>
          <div className="card-value">
            <span className="status-dot" />
            {backend ? "FastAPI" : "Loading..."}
          </div>
          <div className="card-sub">
            {backend ? "Database: ok" : "Checking..."}
          </div>
        </div>

        {/* Provider */}
        <div className="card">
          <div className="card-title">AI Provider</div>
          <div className="card-value">
            <span className="status-dot" />
            {provider ? provider.provider : "Loading..."}
          </div>
          <div className="card-sub">
            {provider
              ? `Chat: ${provider.chat.ok ? "Online" : "Offline"} · Embedding: ${
                  provider.embedding.ok ? "Online" : "Offline"
                }`
              : "Checking..."}
          </div>
        </div>

        {/* Vector */}
        <div className="card">
          <div className="card-title">Vector Store</div>
          <div className="card-value">
            <span className="status-dot" />
            chromadb
          </div>
          <div className="card-sub">
            {vector ? `Heartbeat: ${vector.heartbeat}` : "Checking..."}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Documents ({documents.length})</h2>
      </div>
    </div>
  );
}
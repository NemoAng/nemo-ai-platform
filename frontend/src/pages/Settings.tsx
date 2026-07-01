import { useEffect, useState } from "react";
import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "../services/health";
import type {
  BackendHealth,
  ProviderHealth,
  VectorHealth,
} from "../types/api";

export default function Settings() {
  const [backend, setBackend] = useState<BackendHealth | null>(null);
  const [provider, setProvider] = useState<ProviderHealth | null>(null);
  const [vector, setVector] = useState<VectorHealth | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    Promise.all([
      getBackendHealth(),
      getProviderHealth(),
      getVectorHealth(),
    ])
      .then(([backendHealth, providerHealth, vectorHealth]) => {
        setBackend(backendHealth);
        setProvider(providerHealth);
        setVector(vectorHealth);
      })
      .catch((err) => setStatus((err as Error).message));
  }, []);

  return (
    <div className="page">
      <h1>Settings</h1>
      <p className="page-subtitle">
        System configuration, AI providers, and platform health.
      </p>

      {status && <div className="status">{status}</div>}

      <div className="settings-grid">
        <section className="panel settings-panel">
          <div className="panel-header">
            <h2>AI Provider</h2>
            <span>{provider?.provider ?? "Loading"}</span>
          </div>

          <div className="settings-row">
            <span>Chat</span>
            <strong>{provider?.chat.ok ? "Online" : "Unavailable"}</strong>
          </div>

          <div className="settings-row">
            <span>Embedding</span>
            <strong>{provider?.embedding.ok ? "Online" : "Unavailable"}</strong>
          </div>

          {provider?.chat.error && (
            <div className="settings-error">{provider.chat.error}</div>
          )}

          {provider?.embedding.error && (
            <div className="settings-error">{provider.embedding.error}</div>
          )}
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <h2>Backend</h2>
            <span>{backend?.status.toUpperCase() ?? "Loading"}</span>
          </div>

          <div className="settings-row">
            <span>Service</span>
            <strong>{backend?.service ?? "-"}</strong>
          </div>

          <div className="settings-row">
            <span>Database</span>
            <strong>{backend?.database ?? "-"}</strong>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <h2>Vector Store</h2>
            <span>{vector?.status.toUpperCase() ?? "Loading"}</span>
          </div>

          <div className="settings-row">
            <span>Engine</span>
            <strong>{vector?.vector_store ?? "-"}</strong>
          </div>

          <div className="settings-row">
            <span>Heartbeat</span>
            <strong>{vector?.heartbeat ?? "-"}</strong>
          </div>
        </section>

        <section className="panel settings-panel">
          <div className="panel-header">
            <h2>Roadmap</h2>
            <span>v1.0</span>
          </div>

          <div className="settings-list">
            <div>PDF Upload</div>
            <div>Document Delete</div>
            <div>Chat History</div>
            <div>Markdown Rendering</div>
            <div>OAuth / Login</div>
            <div>Nemo VOD Integration</div>
          </div>
        </section>
      </div>
    </div>
  );
}
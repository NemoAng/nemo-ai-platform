import { useEffect, useState } from "react";
import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "../services/health";
import {
  formatProviderHealthCacheTime,
  getCachedProviderHealth,
  setCachedProviderHealth,
} from "../services/providerHealthCache";
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
  const [providerStatus, setProviderStatus] = useState("Click refresh to check provider health.");
  const [refreshingProvider, setRefreshingProvider] = useState(false);

  useEffect(() => {
    const cachedProvider = getCachedProviderHealth();

    if (cachedProvider) {
      setProvider(cachedProvider.value);
      setProviderStatus(
        `Cached provider health from ${formatProviderHealthCacheTime(cachedProvider.updatedAt)}.`
      );
    }

    Promise.all([
      getBackendHealth(),
      getVectorHealth(),
    ])
      .then(([backendHealth, vectorHealth]) => {
        setBackend(backendHealth);
        setVector(vectorHealth);
      })
      .catch((err) => setStatus((err as Error).message));
  }, []);

  async function refreshProviderHealth() {
    if (refreshingProvider) return;

    setRefreshingProvider(true);
    setProviderStatus("Refreshing provider health...");

    try {
      const providerHealth = await getProviderHealth();
      const cachedProvider = setCachedProviderHealth(providerHealth);
      setProvider(providerHealth);
      setProviderStatus(
        `Provider health refreshed at ${formatProviderHealthCacheTime(cachedProvider.updatedAt)}.`
      );
    } catch (err) {
      setProviderStatus(err instanceof Error ? err.message : "Provider refresh failed.");
    } finally {
      setRefreshingProvider(false);
    }
  }

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
            <div className="panel-header-actions">
              <span>{provider?.provider ?? "Not checked"}</span>
              <button
                className="card-action-button"
                disabled={refreshingProvider}
                onClick={refreshProviderHealth}
              >
                {refreshingProvider ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="settings-hint">{providerStatus}</div>

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

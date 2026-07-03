import { useEffect, useState } from "react";

import {
  getBackendHealth,
  getProviderHealth,
  getVectorHealth,
} from "../services/health";
import { listDocuments } from "../services/document";
import {
  formatProviderHealthCacheTime,
  getCachedProviderHealth,
  setCachedProviderHealth,
} from "../services/providerHealthCache";

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
  const [refreshingProvider, setRefreshingProvider] = useState(false);
  const [providerStatus, setProviderStatus] = useState("Click refresh to check provider health.");

  useEffect(() => {
    const cachedProvider = getCachedProviderHealth();

    if (cachedProvider) {
      setProvider(cachedProvider.value);
      setProviderStatus(
        `Cached provider health from ${formatProviderHealthCacheTime(cachedProvider.updatedAt)}.`
      );
    }

    const loadSystemStatus = () => {
      getBackendHealth().then(setBackend);
      getVectorHealth().then(setVector);
      listDocuments().then(setDocuments);
    };

    loadSystemStatus();
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
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">{providerStatus}</p>
        </div>
      </div>

      <div className="card-grid">
        {/* Backend */}
        <div className="card">
          <div className="card-title">Backend</div>
          <div className="card-value">
            <span className="status-dot" />
            {backend ? "FastAPI" : "Loading..."}
          </div>
          <div className="card-sub">
            {backend ? "Database: OK" : "Checking..."}
          </div>
        </div>

        {/* Provider */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">AI Provider</div>
            <button
              className="card-action-button"
              disabled={refreshingProvider}
              onClick={refreshProviderHealth}
            >
              {refreshingProvider ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="card-value">
            <span className="status-dot" />
            {provider ? provider.provider : "Not checked"}
          </div>
          <div className="card-sub">
            {provider
              ? `Chat: ${provider.chat.ok ? "Online" : "Offline"} · Embedding: ${
                  provider.embedding.ok ? "Online" : "Offline"
                }`
              : "Click refresh to check"}
          </div>
        </div>

        {/* Vector */}
        <div className="card">
          <div className="card-title">Vector Store</div>
          <div className="card-value">
            <span className="status-dot" />
            ChromaDB
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

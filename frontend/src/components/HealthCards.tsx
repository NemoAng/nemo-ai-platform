import type { BackendHealth, ProviderHealth, VectorHealth } from "../types/api";
import { StatusDot } from "./StatusDot";

type Props = {
  backend: BackendHealth | null;
  provider: ProviderHealth | null;
  vector: VectorHealth | null;
};

export function HealthCards({ backend, provider, vector }: Props) {
  return (
    <section className="grid cards">
      <div className="card">
        <div className="card-label">Backend</div>
        <h2>
          <StatusDot ok={backend?.status === "ok"} /> FastAPI
        </h2>
        <p>{backend?.database ? `Database: ${backend.database}` : "Loading..."}</p>
      </div>

      <div className="card">
        <div className="card-label">AI Provider</div>
        <h2>
          <StatusDot ok={!!provider?.chat.ok} /> {provider?.provider || "Loading"}
        </h2>
        <p>
          Chat: {provider?.chat.ok ? "Online" : "Checking"} · Embedding:{" "}
          {provider?.embedding.ok ? "Online" : "Checking"}
        </p>
      </div>

      <div className="card">
        <div className="card-label">Vector Store</div>
        <h2>
          <StatusDot ok={vector?.status === "ok"} /> {vector?.vector_store || "ChromaDB"}
        </h2>
        <p>{vector?.heartbeat ? `Heartbeat: ${vector.heartbeat}` : "Loading..."}</p>
      </div>
    </section>
  );
}

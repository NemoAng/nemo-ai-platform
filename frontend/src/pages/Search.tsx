import { useState } from "react";
import { semanticSearch, type SearchResult } from "../services/search";

export default function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function runSearch() {
    if (!query.trim()) {
      setStatus("Please enter a search query.");
      return;
    }

    setLoading(true);
    setStatus("Searching...");

    try {
      const data = await semanticSearch(query, 8);
      setResult(data);
      setStatus("");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Semantic Search</h1>
      <p className="page-subtitle">
        Search indexed document chunks using embeddings.
      </p>

      <div className="search-bar">
        <input
          placeholder="Search your knowledge base..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button disabled={loading} onClick={runSearch}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {status && <div className="status">{status}</div>}

      {result && (
        <div className="search-results">
          <div className="panel-header">
            <h2>Results</h2>
            <span>
              {result.matches.length} matches · {result.provider}
            </span>
          </div>

          {result.matches.map((match, index) => (
            <div
              className="search-result-card"
              key={`${match.metadata.chunk_id}-${index}`}
            >
              <div className="search-result-title">
                Result {index + 1}
              </div>

              <div className="source-meta">
                Document {match.metadata.document_id ?? "?"} · Chunk{" "}
                {match.metadata.chunk_index ?? "?"} · Distance{" "}
                {match.distance?.toFixed?.(4) ?? match.distance}
              </div>

              <p>{match.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
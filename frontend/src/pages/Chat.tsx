import { useState } from "react";
import { askAI } from "../services/ai";
import type { AskResult } from "../types/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function send() {
    if (!question.trim()) {
      setStatus("Please enter a question.");
      return;
    }

    setLoading(true);
    setStatus("Thinking...");

    try {
      const data = await askAI(question, 5);
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
      <h1>AI Chat</h1>
      <p className="page-subtitle">
        Ask questions against your indexed knowledge base.
      </p>

      <div className="chat-page">
        <div className="chat-history">
          {!result && (
            <div className="empty-state">
              Ask a question about your uploaded documents or PDFs.
            </div>
          )}

          {result && (
            <>
              <div className="message user">
                <strong>You</strong>
                <p>{result.question}</p>
              </div>

              <div className="message ai">
                <strong>Nemo AI · {result.provider}</strong>
                <p>{result.answer}</p>
              </div>

              <div className="sources">
                <h3>Sources</h3>

                {result.sources.map((source) => (
                  <div
                    className="source"
                    key={`${source.document_id}-${source.chunk_id}`}
                  >
                    <strong>
                      Source {source.source_number} · Document{" "}
                      {source.document_id}
                    </strong>
                    <div className="source-meta">
                      Chunk {source.chunk_index} · Distance{" "}
                      {source.distance?.toFixed?.(4) ?? source.distance}
                    </div>
                    <p>{source.content_preview}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="chat-input-bar">
          <textarea
            rows={4}
            placeholder="Ask Nemo AI..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button disabled={loading} onClick={send}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>

        {status && <div className="status">{status}</div>}
      </div>
    </div>
  );
}
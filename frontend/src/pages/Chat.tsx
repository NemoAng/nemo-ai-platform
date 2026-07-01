import { useState } from "react";
import { askAI } from "../services/ai";
import type { AskResult } from "../types/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AskResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const result = await askAI(question, 3);
      setAnswer(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>AI Chat</h1>

      <div className="chat-page">

        <div className="chat-history">

          {answer && (
            <>
              <div className="message user">
                <strong>You</strong>
                <p>{answer.question}</p>
              </div>

              <div className="message ai">
                <strong>Nemo AI</strong>
                <p>{answer.answer}</p>
              </div>

              <div className="sources">
                <h3>Sources</h3>

                {answer.sources.map((s) => (
                  <div
                    key={`${s.document_id}-${s.chunk_id}`}
                    className="source"
                  >
                    <strong>
                      Document {s.document_id}
                    </strong>

                    <div>Chunk {s.chunk_index}</div>

                    <p>{s.content_preview}</p>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

        <div className="chat-input">

          <textarea
            rows={5}
            placeholder="Ask anything..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            disabled={loading}
            onClick={send}
          >
            {loading ? "Thinking..." : "Send"}
          </button>

        </div>

      </div>
    </div>
  );
}
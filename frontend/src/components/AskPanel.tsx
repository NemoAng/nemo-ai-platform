import type { AskResult } from "../types/api";

type Props = {
  question: string;
  answer: AskResult | null;
  status: string;
  onQuestionChange: (value: string) => void;
  onAsk: () => void;
};

export function AskPanel({
  question,
  answer,
  status,
  onQuestionChange,
  onAsk,
}: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Ask AI</h2>
        <span>RAG with cited chunks</span>
      </div>

      <input
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        placeholder="Ask a question about your documents..."
      />

      <button onClick={onAsk}>Ask Nemo AI</button>

      {status && <div className="status">{status}</div>}

      {answer && (
        <div className="answer-box">
          <div className="message user">
            <strong>You</strong>
            <p>{answer.question}</p>
          </div>

          <div className="message ai">
            <strong>Nemo AI · {answer.provider}</strong>
            <p>{answer.answer}</p>
          </div>

          <div className="sources">
            <h3>Sources</h3>
            {answer.sources.map((s) => (
              <div className="source" key={`${s.document_id}-${s.chunk_id}`}>
                <div>
                  Source {s.source_number} · Document {s.document_id} · Chunk{" "}
                  {s.chunk_index}
                </div>
                <p>{s.content_preview}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

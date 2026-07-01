import { useEffect, useState } from "react";
import { askAI } from "../services/ai";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

type Message = {
  role: "user" | "ai";
  content: string;
};

const STORAGE_KEY = "nemo_chat_history";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ 加载历史
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // ✅ 保存历史
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function send() {
    if (!question.trim()) return;

    const userMsg: Message = { role: "user", content: question };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const result = await askAI(question, 5, newMessages) as any;

      const aiMsg: Message = {
        role: "ai",
        content: result.answer,
      };

      const finalMessages = [...newMessages, aiMsg];
      setMessages(finalMessages);

      setSources(result.sources || []);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setSources([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <div className="page">
      <h1>AI Chat</h1>

      <div className="chat-page">

        <div className="chat-history">

          {messages.length === 0 && (
            <div className="empty-state">
              Start a conversation.
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <strong>{msg.role === "user" ? "You" : "Nemo AI"}</strong>

              {msg.role === "ai" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          ))}

          {sources.length > 0 && (
            <div className="sources">
              <h3>Sources</h3>

              {sources.map((s, i) => (
                <div key={i} className="source-card">
                  <strong>[{s.source_number}] Document {s.document_id}</strong>
                  <div className="source-meta">
                    Chunk {s.chunk_index}
                  </div>
                  <p>{s.content_preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chat-toolbar">
          <button onClick={clearChat}>Clear</button>
        </div>

        <div className="chat-input-bar">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button disabled={loading} onClick={send}>
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
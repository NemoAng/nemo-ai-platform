import { useEffect, useState } from "react";
import { askAIStream } from "../services/ai";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import type { AskResult } from "../types/api";

type Message = {
  role: "user" | "ai";
  content: string;
};

const STORAGE_KEY = "nemo_chat_history";

type Source = AskResult["sources"][number];

function getCitedSources(answer: string, allSources: Source[]) {
  const citedNumbers = new Set<number>();
  const citationPattern = /\[(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = citationPattern.exec(answer)) !== null) {
    citedNumbers.add(Number(match[1]));
  }

  return allSources.filter((source) => citedNumbers.has(source.source_number));
}

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    setSources([]);
    setLoading(true);

    try {
      const aiMsg: Message = {
        role: "ai",
        content: "",
      };

      const aiIndex = newMessages.length;
      let streamedAnswer = "";
      let availableSources: Source[] = [];
      setMessages([...newMessages, aiMsg]);

      await askAIStream(question, 5, newMessages, {
        onMeta: (meta) => {
          availableSources = meta.sources || [];
        },
        onToken: (token) => {
          streamedAnswer += token;
          setMessages((current) =>
            current.map((message, index) =>
              index === aiIndex
                ? { ...message, content: message.content + token }
                : message
            )
          );
        },
        onDone: () => {
          setSources(getCitedSources(streamedAnswer, availableSources));
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send message.";
      setError(message);
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
	  <button onClick={clearChat}>Clear</button>
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
		  
          {error && (
            <div className="chat-error">
              {error}
            </div>
          )}		  
        </div>



        <div className="chat-input-row">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
        </div>
		  <div className="chat-buttons">
			  <button disabled={loading || !question.trim()} onClick={send}>
				{loading ? "Thinking..." : "Send"}
			  </button>
		  </div>
      </div>
    </div>
  );
}

import { requestJson } from "./client";
import type { AskResult, AskStreamEvent, AskStreamMeta } from "../types/api";

const API_BASE = "/ai-api";

export function askAI(
  question: string,
  topK = 5,
  messages: any[] = []
) {
  return requestJson<AskResult>("/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: question,
      top_k: topK,
      messages,
    }),
  });
}

type StreamCallbacks = {
  onMeta?: (meta: AskStreamMeta) => void;
  onToken?: (token: string) => void;
  onDone?: () => void;
};

export async function askAIStream(
  question: string,
  topK = 5,
  messages: any[] = [],
  callbacks: StreamCallbacks = {}
) {
  const res = await fetch(`${API_BASE}/ask/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: question,
      top_k: topK,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(body || `HTTP ${res.status}`);
  }

  if (!res.body) {
    throw new Error("Streaming is not supported by this browser.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;

      const event = JSON.parse(line) as AskStreamEvent;

      if (event.type === "meta") {
        callbacks.onMeta?.(event);
      } else if (event.type === "token") {
        callbacks.onToken?.(event.content || "");
      } else if (event.type === "done") {
        callbacks.onDone?.();
      } else if (event.type === "error") {
        throw new Error(event.message || "Streaming failed.");
      }
    }
  }

  if (buffer.trim()) {
    const event = JSON.parse(buffer) as AskStreamEvent;
    if (event.type === "token") callbacks.onToken?.(event.content || "");
    if (event.type === "done") callbacks.onDone?.();
    if (event.type === "error") throw new Error(event.message || "Streaming failed.");
  }
}

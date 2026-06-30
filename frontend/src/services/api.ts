import type {
  AskResult,
  BackendHealth,
  ProviderHealth,
  VectorHealth,
} from "../types/api";

const API_BASE = "/ai-api";

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

export function getBackendHealth() {
  return requestJson<BackendHealth>("/health");
}

export function getProviderHealth() {
  return requestJson<ProviderHealth>("/ai/provider/health");
}

export function getVectorHealth() {
  return requestJson<VectorHealth>("/vector/health");
}

export function createDocument(title: string, content: string) {
  return requestJson<{ id: number; title: string; indexed: boolean }>(
    "/documents",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        source_type: "text",
      }),
    }
  );
}

export function askAI(question: string, topK = 3) {
  return requestJson<AskResult>(
    `/ask?q=${encodeURIComponent(question)}&top_k=${topK}`
  );
}

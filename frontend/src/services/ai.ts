import { requestJson } from "./client";
import type { AskResult } from "../types/api";

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
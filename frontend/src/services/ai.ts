import type { AskResult } from "../types/api";
import { requestJson } from "./client";

export function askAI(question: string, topK = 3) {
  return requestJson<AskResult>(
    `/ask?q=${encodeURIComponent(question)}&top_k=${topK}`
  );
}

import type { BackendHealth, ProviderHealth, VectorHealth } from "../types/api";
import { requestJson } from "./client";

export function getBackendHealth() {
  return requestJson<BackendHealth>("/health");
}

export function getProviderHealth() {
  return requestJson<ProviderHealth>("/ai/provider/health");
}

export function getVectorHealth() {
  return requestJson<VectorHealth>("/vector/health");
}

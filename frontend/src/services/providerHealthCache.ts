import type { ProviderHealth } from "../types/api";

const AI_PROVIDER_CACHE_KEY = "nemo_ai_provider_health";

export type CachedProviderHealth = {
  value: ProviderHealth;
  updatedAt: string;
};

export function getCachedProviderHealth(): CachedProviderHealth | null {
  const raw = localStorage.getItem(AI_PROVIDER_CACHE_KEY);

  if (!raw) return null;

  try {
    return JSON.parse(raw) as CachedProviderHealth;
  } catch {
    localStorage.removeItem(AI_PROVIDER_CACHE_KEY);
    return null;
  }
}

export function setCachedProviderHealth(value: ProviderHealth) {
  const cached: CachedProviderHealth = {
    value,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(AI_PROVIDER_CACHE_KEY, JSON.stringify(cached));
  return cached;
}

export function formatProviderHealthCacheTime(updatedAt: string) {
  return new Date(updatedAt).toLocaleString();
}

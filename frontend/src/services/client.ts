const API_BASE = "/ai-api";

export async function requestJson<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, options);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

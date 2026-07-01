import { requestJson } from "./client";

export type SearchMatch = {
  content: string;
  metadata: {
    document_id?: number;
    chunk_id?: number;
    chunk_index?: number;
  };
  distance: number;
};

export type SearchResult = {
  query: string;
  provider: string;
  top_k: number;
  matches: SearchMatch[];
};

export function semanticSearch(query: string, topK = 5) {
  return requestJson<SearchResult>(
    `/search?q=${encodeURIComponent(query)}&top_k=${topK}`
  );
}
export type BackendHealth = {
  status: string;
  service: string;
  database?: string;
};

export type ProviderHealth = {
  provider: string;
  chat: { ok: boolean; error: string | null };
  embedding: { ok: boolean; error: string | null };
};

export type VectorHealth = {
  vector_store: string;
  status: string;
  heartbeat?: number;
};

export type AskResult = {
  question: string;
  answer: string;
  provider: string;
  sources: {
    source_number: number;
    document_id: number;
    chunk_id: number;
    chunk_index: number;
    distance: number;
    content_preview: string;
  }[];
};

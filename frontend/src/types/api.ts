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

export type AskStreamMeta = Pick<AskResult, "question" | "provider" | "sources">;

export type AskStreamEvent =
  | ({ type: "meta" } & AskStreamMeta)
  | { type: "token"; content: string }
  | { type: "done" }
  | { type: "error"; message: string };
 
export type DocumentItem = {
  id: number;
  title: string;
  source_type: string;
};

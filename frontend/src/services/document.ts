import { requestJson } from "./client";

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

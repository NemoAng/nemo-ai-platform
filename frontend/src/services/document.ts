import type { DocumentItem } from "../types/api";
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

export function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return requestJson<{
    id: number;
    title: string;
    source_type: string;
    indexed: boolean;
  }>("/documents/upload", {
    method: "POST",
    body: formData,
  });
}

export function deleteDocument(documentId: number) {
  return requestJson<{
    deleted: boolean;
    document_id: number;
  }>(`/documents/${documentId}`, {
    method: "DELETE",
  });
}

export function listDocuments() {
  return requestJson<DocumentItem[]>("/documents");
}
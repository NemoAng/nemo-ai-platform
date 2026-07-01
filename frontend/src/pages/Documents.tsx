import { useEffect, useState } from "react";
import { createDocument, listDocuments, uploadPdf } from "../services/document";
import type { DocumentItem } from "../types/api";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  async function refresh() {
    try {
      const docs = await listDocuments();
      setDocuments(docs);
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function saveTextDocument() {
    if (!title.trim() || !content.trim()) {
      setStatus("Please enter title and content.");
      return;
    }

    setSaving(true);
    setStatus("Saving and indexing text document...");

    try {
      await createDocument(title, content);
      setTitle("");
      setContent("");
      await refresh();
      setStatus("Text document indexed successfully.");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handlePdfUpload(file: File | null) {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setStatus("Only PDF files are supported.");
      return;
    }

    setUploading(true);
    setStatus("Uploading and indexing PDF...");

    try {
      await uploadPdf(file);
      await refresh();
      setStatus("PDF indexed successfully.");
    } catch (err) {
      setStatus((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page">
      <h1>Documents</h1>
      <p className="page-subtitle">
        Build your private AI knowledge base with text documents and PDFs.
      </p>

      <div className="documents-layout">
        <section className="panel">
          <div className="panel-header">
            <h2>Upload PDF</h2>
            <span>Extract text + embed + index</span>
          </div>

          <label className="upload-box">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => handlePdfUpload(e.target.files?.[0] ?? null)}
            />
            <div className="upload-title">
              {uploading ? "Uploading..." : "Choose PDF"}
            </div>
            <div className="upload-subtitle">
              PDF text will be extracted and indexed into ChromaDB.
            </div>
          </label>

          <div className="panel-header secondary">
            <h2>Add Text</h2>
            <span>Manual note</span>
          </div>

          <input
            placeholder="Document title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows={10}
            placeholder="Paste document content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button disabled={saving} onClick={saveTextDocument}>
            {saving ? "Saving..." : "Save & Index"}
          </button>

          {status && <div className="status">{status}</div>}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Knowledge Base</h2>
            <span>{documents.length} documents</span>
          </div>

          <div className="document-list standalone">
            {documents.length === 0 && (
              <p className="muted">No documents yet.</p>
            )}

            {documents.map((doc) => (
              <div key={doc.id} className="document-item">
                <div>
                  <strong>{doc.title}</strong>
                  <span>{doc.source_type}</span>
                </div>
                <small>#{doc.id}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
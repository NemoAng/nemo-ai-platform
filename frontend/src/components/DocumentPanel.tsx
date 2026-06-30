import type { DocumentItem } from "../types/api";

type Props = {
  title: string;
  content: string;
  documents: DocumentItem[];
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
};

export function DocumentPanel({
  title,
  content,
  documents,
  onTitleChange,
  onContentChange,
  onSave,
}: Props) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Add Document</h2>
        <span>Auto chunk + embed + index</span>
      </div>

      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Document title"
      />

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Paste document content here..."
        rows={10}
      />

      <button onClick={onSave}>Save & Index</button>

      <div className="document-list">
        <h3>Documents</h3>
        {documents.length === 0 && <p className="muted">No documents yet.</p>}

        {documents.map((doc) => (
          <div className="document-item" key={doc.id}>
            <div>
              <strong>{doc.title}</strong>
              <span>{doc.source_type}</span>
            </div>
            <small>#{doc.id}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
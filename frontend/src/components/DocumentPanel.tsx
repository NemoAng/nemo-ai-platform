type Props = {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onSave: () => void;
};

export function DocumentPanel({
  title,
  content,
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
    </div>
  );
}

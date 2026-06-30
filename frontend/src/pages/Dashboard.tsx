import { AskPanel } from "../components/AskPanel";
import { DocumentPanel } from "../components/DocumentPanel";
import { HealthCards } from "../components/HealthCards";

import type {
  AskResult,
  BackendHealth,
  ProviderHealth,
  VectorHealth,
} from "../types/api";

type Props = {
  backend: BackendHealth | null;
  provider: ProviderHealth | null;
  vector: VectorHealth | null;

  title: string;
  content: string;
  question: string;
  answer: AskResult | null;
  status: string;

  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onQuestionChange: (value: string) => void;
  onSaveDocument: () => void;
  onAskAI: () => void;
};

export function Dashboard({
  backend,
  provider,
  vector,
  title,
  content,
  question,
  answer,
  status,
  onTitleChange,
  onContentChange,
  onQuestionChange,
  onSaveDocument,
  onAskAI,
}: Props) {
  return (
    <>
      <HealthCards backend={backend} provider={provider} vector={vector} />

      <section className="workspace">
        <DocumentPanel
          title={title}
          content={content}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          onSave={onSaveDocument}
        />

        <AskPanel
          question={question}
          answer={answer}
          status={status}
          onQuestionChange={onQuestionChange}
          onAsk={onAskAI}
        />
      </section>
    </>
  );
}

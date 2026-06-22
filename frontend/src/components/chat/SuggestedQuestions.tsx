"use client";

interface Props {
  onSelect: (q: string) => void;
}

const QUESTIONS = [
  "What AI/LLM projects have you built?",
  "How have you worked with RAG or vector databases?",
  "What's your experience with Python and AI frameworks?",
  "Have you deployed AI systems to production?",
];

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="px-3 pb-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-tertiary mb-2 px-1">
        Suggested
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-xs px-2.5 py-1.5 bg-surface-2 text-ink-subtle border border-hairline rounded-md hover:text-ink hover:border-hairline-strong transition-colors font-medium"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

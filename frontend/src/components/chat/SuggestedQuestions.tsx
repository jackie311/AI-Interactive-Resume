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
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">
        Suggested
      </p>
      <div className="flex flex-wrap gap-1.5">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-xs px-2.5 py-1.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg hover:bg-violet-100 transition-all font-medium"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

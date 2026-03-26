"use client";

interface Props {
  onSelect: (q: string) => void;
}

const QUESTIONS = [
  "What's your strongest project?",
  "Tell me about your Python experience",
  "Are you open to remote work?",
  "What's your experience with AWS?",
  "你会哪些编程语言？",
  "What AI/ML tools have you used?",
];

export default function SuggestedQuestions({ onSelect }: Props) {
  return (
    <div className="px-3 pb-2">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1.5 px-1">Suggested questions</p>
      <div className="flex flex-wrap gap-1.5">
        {QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-xs px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

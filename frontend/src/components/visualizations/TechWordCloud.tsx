"use client";

import { useMemo } from "react";
import { SkillEntry } from "@/lib/types";

interface Props {
  languages: SkillEntry[];
  otherTags: string[];
}

const COLORS = [
  "text-indigo-600 dark:text-indigo-400",
  "text-purple-600 dark:text-purple-400",
  "text-blue-600 dark:text-blue-400",
  "text-cyan-600 dark:text-cyan-400",
  "text-teal-600 dark:text-teal-400",
  "text-green-600 dark:text-green-400",
  "text-emerald-600 dark:text-emerald-400",
];

export default function TechWordCloud({ languages, otherTags }: Props) {
  const words = useMemo(() => {
    const langWords = languages.map((l) => ({ text: l.name, weight: l.years }));
    const other = otherTags.map((t) => ({ text: t, weight: 1.5 }));
    const all = [...langWords, ...other];
    // Shuffle for visual variety
    return all.sort(() => Math.random() - 0.5);
  }, [languages, otherTags]);

  const maxWeight = Math.max(...words.map((w) => w.weight));

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tech Stack</h3>
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {words.map((word, i) => {
          const size = 10 + (word.weight / maxWeight) * 14;
          const color = COLORS[i % COLORS.length];
          return (
            <span
              key={word.text}
              className={`font-semibold ${color} cursor-default hover:scale-110 transition-transform`}
              style={{ fontSize: `${size}px` }}
              title={`${word.text} — ${word.weight}+ years`}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

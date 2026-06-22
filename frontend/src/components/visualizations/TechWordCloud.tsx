"use client";

import { useMemo } from "react";
import { SkillEntry } from "@/lib/types";

interface Props {
  languages: SkillEntry[];
  otherTags: string[];
}

// Tonal ink scale with scarce lavender accents (no second chromatic color)
const COLORS = [
  "text-ink",
  "text-ink-muted",
  "text-ink-subtle",
  "text-primary",
  "text-ink-muted",
  "text-ink",
  "text-ink-subtle",
];

export default function TechWordCloud({ languages, otherTags }: Props) {
  const words = useMemo(() => {
    const langWords = languages.map((l) => ({ text: l.name, weight: l.years }));
    const langNames = new Set(languages.map((l) => l.name));
    const other = otherTags.filter((t) => !langNames.has(t)).map((t) => ({ text: t, weight: 1.5 }));
    const all = [...langWords, ...other];
    // Deterministic shuffle based on text content (avoids SSR/client mismatch)
    return all.sort((a, b) => {
      const ha = a.text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const hb = b.text.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return (ha % 7) - (hb % 7) || a.text.localeCompare(b.text);
    });
  }, [languages, otherTags]);

  const maxWeight = Math.max(...words.map((w) => w.weight));

  return (
    <div className="bg-surface-1 rounded-xl border border-hairline p-4">
      <h3 className="text-sm font-semibold text-ink-muted mb-3">Tech Stack</h3>
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

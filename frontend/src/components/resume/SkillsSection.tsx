"use client";

import { Skills } from "@/lib/types";

interface Props {
  skills: Skills;
}

export default function SkillsSection({ skills }: Props) {
  const tagCategories: [string, string[]][] = [
    ["Frontend", skills.frontend],
    ["Backend", skills.backend],
    ["Databases", skills.databases],
    ["DevOps & Cloud", skills.devops_cloud],
    ["AI & ML", skills.ai_ml],
  ];

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Skills
      </h2>

      {/* Tag clouds */}
      <div className="space-y-3">
        {tagCategories.map(([label, tags]) => (
          <div key={label}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-1.5">
              {label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 border rounded-md font-medium bg-surface-1 text-ink-muted border-hairline"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

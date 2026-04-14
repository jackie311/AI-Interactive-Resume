"use client";

import { Skills } from "@/lib/types";

interface Props {
  skills: Skills;
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-violet-50 text-violet-700 border-violet-100",
  Backend: "bg-blue-50 text-blue-700 border-blue-100",
  Databases: "bg-cyan-50 text-cyan-700 border-cyan-100",
  "DevOps & Cloud": "bg-emerald-50 text-emerald-700 border-emerald-100",
  "AI & ML": "bg-amber-50 text-amber-700 border-amber-100",
};

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
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Skills
      </h2>

      {/* Tag clouds */}
      <div className="space-y-3">
        {tagCategories.map(([label, tags]) => (
          <div key={label}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
              {label}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2.5 py-1 border rounded-lg font-medium ${CATEGORY_COLORS[label]}`}
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

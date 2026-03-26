"use client";

import { Skills } from "@/lib/types";
import { motion } from "framer-motion";

interface Props {
  skills: Skills;
}

const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20",
  Backend: "bg-blue-50 dark:bg-blue-500/[0.08] text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20",
  Databases: "bg-cyan-50 dark:bg-cyan-500/[0.08] text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-500/20",
  "DevOps & Cloud": "bg-emerald-50 dark:bg-emerald-500/[0.08] text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20",
  "AI & ML": "bg-amber-50 dark:bg-amber-500/[0.08] text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-500/20",
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
      <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Skills
      </h2>

      {/* Language proficiency bars */}
      <div className="mb-5 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          Languages
        </h3>
        <div className="space-y-2.5">
          {skills.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 w-24 shrink-0">{lang.name}</span>
              <div className="flex-1 h-2 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lang.level / 5) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 rounded-full"
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 w-12 shrink-0 text-right">
                {lang.years}y exp
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tag clouds */}
      <div className="space-y-3">
        {tagCategories.map(([label, tags]) => (
          <div key={label}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">
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

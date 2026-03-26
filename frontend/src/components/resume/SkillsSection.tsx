"use client";

import { Skills } from "@/lib/types";
import { motion } from "framer-motion";

interface Props {
  skills: Skills;
}

const CATEGORY_LABELS: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  backend: "Backend",
  databases: "Databases",
  devops_cloud: "DevOps & Cloud",
  ai_ml: "AI & ML",
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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
        Skills
      </h2>

      {/* Language proficiency bars */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
          Languages
        </h3>
        <div className="space-y-2">
          {skills.languages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <span className="text-sm text-gray-700 dark:text-gray-300 w-24 shrink-0">{lang.name}</span>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(lang.level / 5) * 100}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 w-12 shrink-0">
                {lang.years}y exp
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tag clouds */}
      {tagCategories.map(([label, tags]) => (
        <div key={label} className="mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">
            {label}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

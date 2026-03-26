"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  project: Project;
  index: number;
  githubStats?: { stars: number; forks: number };
}

export default function ProjectCard({ project, index, githubStats }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.07 }}
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-white dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] p-5 hover:border-violet-200 dark:hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.06] transition-all group"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {project.name}
            </h3>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {githubStats && (
              <span className="flex items-center gap-0.5 text-xs text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3" /> {githubStats.stars}
              </span>
            )}
            <span className="text-xs text-gray-400">{project.year}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-2">
          {project.description}
        </p>

        {project.impact && (
          <div className="bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-100 dark:border-emerald-500/20 rounded-lg px-3 py-1.5 mb-3">
            <p className="text-xs text-emerald-700 dark:text-emerald-400 line-clamp-1">
              <span className="font-semibold">Impact:</span> {project.impact}
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20 rounded-md"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 5 && (
            <span className="text-xs px-2 py-0.5 text-gray-400 dark:text-gray-500">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        {project.featured && (
          <div className="mt-3 flex">
            <span className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full border border-violet-100 dark:border-violet-500/25 font-medium">
              Featured
            </span>
          </div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white dark:bg-[#111118] rounded-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {project.name}
                    </h2>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full border border-violet-100 dark:border-violet-500/25 font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-violet-600 dark:text-violet-400 mt-0.5">{project.tagline}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.07] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 pb-6 space-y-4">
                {/* Description - full, no clamp */}
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Impact */}
                {project.impact && (
                  <div className="bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-100 dark:border-emerald-500/20 rounded-xl px-4 py-3">
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">
                      <span className="font-semibold">Impact:</span> {project.impact}
                    </p>
                  </div>
                )}

                {/* Tech stack - all tags */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                    Tech Stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20 rounded-lg font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between pt-1 border-t border-black/[0.06] dark:border-white/[0.06]">
                  <span className="text-xs text-gray-400">{project.year}</span>
                  {githubStats && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                      <Star className="w-3.5 h-3.5" /> {githubStats.stars} stars
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

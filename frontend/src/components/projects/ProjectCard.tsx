"use client";

import { useState } from "react";
import { Project } from "@/lib/types";
import { GitBranch, X, Zap, Lightbulb, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
}

export default function ProjectCard({ project, index, featured = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.07 }}
        onClick={() => setOpen(true)}
        className={`cursor-pointer bg-white dark:bg-white/[0.03] rounded-xl border border-black/[0.06] dark:border-white/[0.06] hover:border-violet-200 dark:hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/[0.07] transition-all group ${featured ? "p-6" : "p-5"}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors ${featured ? "text-lg" : "text-base"}`}>
                {project.name}
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500">{project.year}</span>
            </div>
            <p className="text-sm text-violet-600 dark:text-violet-400 font-medium leading-snug">
              {project.tagline}
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] transition-all">
                <GitBranch className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
          {project.description}
        </p>

        {project.impact && (
          <div className="bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-100 dark:border-emerald-500/20 rounded-lg px-3 py-2 mb-3 flex gap-2 items-start">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400 line-clamp-2">{project.impact}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, featured ? 7 : 5).map((t) => (
            <span key={t}
              className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20 rounded-md">
              {t}
            </span>
          ))}
          {project.tech.length > (featured ? 7 : 5) && (
            <span className="text-xs px-2 py-0.5 text-gray-400 dark:text-gray-500">
              +{project.tech.length - (featured ? 7 : 5)}
            </span>
          )}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-white dark:bg-[#111118] rounded-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4 shrink-0">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full border border-violet-100 dark:border-violet-500/25 font-medium">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{project.year}</span>
                  </div>
                  <p className="text-sm text-violet-600 dark:text-violet-400 mt-0.5 font-medium">{project.tagline}</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-black/[0.06] dark:hover:bg-white/[0.07] transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="px-6 pb-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Problem / Solution / Impact */}
                {(project.problem || project.solution || project.impact) && (
                  <div className="space-y-2.5">
                    {project.problem && (
                      <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/[0.07] border border-amber-100 dark:border-amber-500/20">
                        <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">Problem</div>
                          <p className="text-sm text-amber-900 dark:text-amber-200/80 leading-relaxed">{project.problem}</p>
                        </div>
                      </div>
                    )}
                    {project.solution && (
                      <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/[0.07] border border-blue-100 dark:border-blue-500/20">
                        <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-0.5">Solution</div>
                          <p className="text-sm text-blue-900 dark:text-blue-200/80 leading-relaxed">{project.solution}</p>
                        </div>
                      </div>
                    )}
                    {project.impact && (
                      <div className="flex gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/[0.07] border border-emerald-100 dark:border-emerald-500/20">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">Impact</div>
                          <p className="text-sm text-emerald-900 dark:text-emerald-200/80 leading-relaxed">{project.impact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tech stack */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t}
                        className="text-xs px-2.5 py-1 bg-violet-50 dark:bg-violet-500/[0.08] text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-500/20 rounded-lg font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {project.github && (
                  <div className="flex gap-2 pt-1 border-t border-black/[0.06] dark:border-white/[0.06]">
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/[0.07] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/[0.1] transition-all">
                      <GitBranch className="w-3.5 h-3.5" /> GitHub
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

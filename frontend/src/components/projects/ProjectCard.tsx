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
        className={`cursor-pointer bg-white rounded-xl border border-black/[0.06] hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/[0.07] transition-all group ${featured ? "p-6" : "p-5"}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`font-semibold text-gray-900 group-hover:text-violet-600 transition-colors ${featured ? "text-lg" : "text-base"}`}>
                {project.name}
              </h3>
              <span className="text-xs text-gray-400">{project.year}</span>
            </div>
            <p className="text-sm text-violet-600 font-medium leading-snug">
              {project.tagline}
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/[0.06] transition-all">
                <GitBranch className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className={`text-sm text-gray-600 leading-relaxed mb-3 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
          {project.description}
        </p>

        {project.impact && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-3 flex gap-2 items-start">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-700 line-clamp-2">{project.impact}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, featured ? 7 : 5).map((t) => (
            <span key={t}
              className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-md">
              {t}
            </span>
          ))}
          {project.tech.length > (featured ? 7 : 5) && (
            <span className="text-xs px-2 py-0.5 text-gray-400">
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-xl bg-white rounded-t-2xl sm:rounded-2xl border border-black/[0.08] shadow-2xl shadow-black/20 overflow-hidden max-h-[92dvh] sm:max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-4 shrink-0">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-gray-900">{project.name}</h2>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100 font-medium">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{project.year}</span>
                  </div>
                  <p className="text-sm text-violet-600 mt-0.5 font-medium">{project.tagline}</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/[0.06] transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="px-4 sm:px-6 pb-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {project.description}
                </p>

                {/* Problem / Solution / Impact */}
                {(project.problem || project.solution || project.impact) && (
                  <div className="space-y-2.5">
                    {project.problem && (
                      <div className="flex gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <Zap className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-0.5">Problem</div>
                          <p className="text-sm text-amber-900 leading-relaxed">{project.problem}</p>
                        </div>
                      </div>
                    )}
                    {project.solution && (
                      <div className="flex gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-0.5">Solution</div>
                          <p className="text-sm text-blue-900 leading-relaxed">{project.solution}</p>
                        </div>
                      </div>
                    )}
                    {project.impact && (
                      <div className="flex gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                        <TrendingUp className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-0.5">Impact</div>
                          <p className="text-sm text-emerald-900 leading-relaxed">{project.impact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tech stack */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t}
                        className="text-xs px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {project.github && (
                  <div className="flex gap-2 pt-1 border-t border-black/[0.06]">
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
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

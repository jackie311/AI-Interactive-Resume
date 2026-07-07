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
        className={`cursor-pointer bg-surface-1 rounded-xl border border-hairline hover:border-hairline-strong hover:bg-surface-2 transition-colors group ${featured ? "p-6" : "p-5"}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`font-semibold text-ink group-hover:text-primary-hover transition-colors ${featured ? "text-lg" : "text-base"}`}>
                {project.name}
              </h3>
              <span className="text-xs text-ink-tertiary">{project.year}</span>
            </div>
            <p className="text-sm text-ink-muted font-medium leading-snug">
              {project.tagline}
            </p>
          </div>
          <div className="flex gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-3 transition-colors">
                <GitBranch className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <p className={`text-sm text-ink-subtle leading-relaxed mb-3 ${featured ? "line-clamp-3" : "line-clamp-2"}`}>
          {project.description}
        </p>

        {project.impact && (
          <div className="bg-surface-2 border border-hairline rounded-md px-3 py-2 mb-3 flex gap-2 items-start">
            <TrendingUp className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
            <p className="text-xs text-ink-muted line-clamp-2">{project.impact}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {project.tech.slice(0, featured ? 7 : 5).map((t) => (
            <span key={t}
              className="text-xs px-2 py-0.5 bg-surface-2 text-ink-subtle border border-hairline rounded-md">
              {t}
            </span>
          ))}
          {project.tech.length > (featured ? 7 : 5) && (
            <span className="text-xs px-2 py-0.5 text-ink-tertiary">
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
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-xl bg-surface-1 rounded-t-2xl sm:rounded-2xl border border-hairline-strong shadow-2xl shadow-ink/10 overflow-hidden max-h-[92dvh] sm:max-h-[85vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 sm:p-6 pb-4 shrink-0">
                <div className="min-w-0 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-semibold text-ink tracking-display">{project.name}</h2>
                    {project.featured && (
                      <span className="text-xs px-2 py-0.5 bg-surface-3 text-ink-muted rounded-full border border-hairline font-medium">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-ink-tertiary">{project.year}</span>
                  </div>
                  <p className="text-sm text-ink-muted mt-0.5 font-medium">{project.tagline}</p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="shrink-0 p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-3 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="px-4 sm:px-6 pb-6 space-y-4 overflow-y-auto">
                <p className="text-sm text-ink-muted leading-relaxed">
                  {project.description}
                </p>

                {/* Highlights */}
                {project.highlights?.length > 0 && (
                  <ul className="space-y-2">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-ink-muted leading-relaxed">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-ink-tertiary shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Problem / Solution / Impact */}
                {(project.problem || project.solution || project.impact) && (
                  <div className="space-y-2.5">
                    {project.problem && (
                      <div className="flex gap-3 p-3 rounded-xl bg-surface-2 border border-hairline">
                        <Zap className="w-4 h-4 text-ink-subtle mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-subtle mb-0.5">Problem</div>
                          <p className="text-sm text-ink-muted leading-relaxed">{project.problem}</p>
                        </div>
                      </div>
                    )}
                    {project.solution && (
                      <div className="flex gap-3 p-3 rounded-xl bg-surface-2 border border-hairline">
                        <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Solution</div>
                          <p className="text-sm text-ink-muted leading-relaxed">{project.solution}</p>
                        </div>
                      </div>
                    )}
                    {project.impact && (
                      <div className="flex gap-3 p-3 rounded-xl bg-surface-2 border border-hairline">
                        <TrendingUp className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-success mb-0.5">Impact</div>
                          <p className="text-sm text-ink-muted leading-relaxed">{project.impact}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tech stack */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t}
                        className="text-xs px-2.5 py-1 bg-surface-2 text-ink-subtle border border-hairline rounded-md font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                {project.github && (
                  <div className="flex gap-2 pt-1 border-t border-hairline">
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-surface-3 text-ink-muted border border-hairline hover:text-ink hover:border-hairline-strong transition-colors">
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

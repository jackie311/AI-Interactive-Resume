"use client";

import { Project } from "@/lib/types";
import { ExternalLink, GitBranch, Star, GitFork } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  project: Project;
  index: number;
  githubStats?: { stars: number; forks: number };
}

export default function ProjectCard({ project, index, githubStats }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">{project.tagline}</p>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{project.year}</span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 line-clamp-3">
        {project.description}
      </p>

      {project.impact && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg px-3 py-1.5 mb-3">
          <p className="text-xs text-green-800 dark:text-green-400">
            <span className="font-semibold">Impact:</span> {project.impact}
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.tech.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              Code
              {githubStats && (
                <span className="ml-1 flex items-center gap-0.5 text-amber-600 dark:text-amber-400">
                  <Star className="w-3 h-3" /> {githubStats.stars}
                </span>
              )}
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </a>
          )}
        </div>
        {project.featured && (
          <span className="text-xs px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800">
            Featured
          </span>
        )}
      </div>
    </motion.div>
  );
}

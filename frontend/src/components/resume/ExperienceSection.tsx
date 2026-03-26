"use client";

import { Job } from "@/lib/types";
import { Building2, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  experience: Job[];
}

export default function ExperienceSection({ experience }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
        Experience
      </h2>
      <div className="space-y-6">
        {experience.map((job, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700"
          >
            <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            <div className="flex items-start justify-between flex-wrap gap-1">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{job.role}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{job.company}</span>
                  <span>·</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                {job.period}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{job.description}</p>

            <ul className="mt-2 space-y-1">
              {job.highlights.map((h, j) => (
                <li key={j} className="text-sm text-gray-600 dark:text-gray-300 flex gap-2">
                  <span className="text-indigo-500 shrink-0 mt-0.5">▸</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {job.tech.map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

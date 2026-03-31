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
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Experience
      </h2>
      <div className="space-y-3">
        {experience.map((job, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.07 }}
            className="group p-4 rounded-xl bg-white border border-black/[0.06] hover:border-violet-200 hover:shadow-lg hover:shadow-violet-500/[0.06] transition-all"
          >
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{job.role}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <Building2 className="w-3 h-3" />
                  <span className="font-medium text-gray-600">{job.company}</span>
                  <span>·</span>
                  <MapPin className="w-3 h-3" />
                  <span>{job.location}</span>
                </div>
              </div>
              <span className="text-xs text-gray-400 bg-black/[0.04] px-2.5 py-1 rounded-full border border-black/[0.05]">
                {job.period}
              </span>
            </div>

            <p className="mt-2.5 text-xs text-gray-500 leading-relaxed">{job.description}</p>

            <ul className="mt-2 space-y-1">
              {job.highlights.map((h, j) => (
                <li key={j} className="text-xs text-gray-600 flex gap-2">
                  <span className="text-violet-500 shrink-0 mt-0.5">▸</span>
                  {h}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-md"
                >
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

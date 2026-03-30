"use client";

import { PersonalInfo, Availability } from "@/lib/types";
import { MapPin, Mail, GitBranch, Link2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  personal: PersonalInfo;
  availability: Availability;
}

export default function AboutSection({ personal, availability }: Props) {
  const initials = personal.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <div className="flex items-start gap-5 flex-wrap">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-violet-500/25">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-4xl font-bold tracking-tight gradient-text leading-tight">
                {/* {personal.name} */}11
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 font-medium mt-1">
                {personal.title}
              </p>
            </div>
            {personal.open_to_work && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Open to Work
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06]">
          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {personal.location}
        </span>
        <a
          href={`mailto:${personal.email}`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
        >
          <Mail className="w-3.5 h-3.5" /> {personal.email}
        </a>
        <a
          href={personal.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
        >
          <GitBranch className="w-3.5 h-3.5" /> GitHub
        </a>
        <a
          href={personal.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-gray-500 dark:text-gray-400 bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.06] hover:border-violet-300 dark:hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
        >
          <Link2 className="w-3.5 h-3.5" /> LinkedIn
        </a>
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
        {personal.bio}
      </p>

      <div className="mt-4 p-3.5 bg-violet-50/60 dark:bg-violet-500/[0.07] rounded-xl border border-violet-100 dark:border-violet-500/20">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-violet-500 shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Seeking:</span>{" "}
            {availability.preferred_roles.join(" · ")}
          </span>
        </div>
        <div className="flex gap-2 mt-2 flex-wrap">
          {availability.work_arrangement.map((a) => (
            <span
              key={a}
              className="text-xs px-2.5 py-1 bg-white dark:bg-[#1a1a2e] border border-violet-200 dark:border-violet-500/30 rounded-full text-violet-700 dark:text-violet-300 font-medium"
            >
              {a}
            </span>
          ))}
          <span className="text-xs px-2.5 py-1 bg-white dark:bg-[#1a1a2e] border border-violet-200 dark:border-violet-500/30 rounded-full text-violet-700 dark:text-violet-300 font-medium">
            {availability.notice_period} notice
          </span>
        </div>
      </div>
    </motion.section>
  );
}

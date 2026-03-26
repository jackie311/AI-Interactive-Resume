"use client";

import { PersonalInfo, Availability } from "@/lib/types";
import { MapPin, Mail, GitBranch, Link2, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  personal: PersonalInfo;
  availability: Availability;
}

export default function AboutSection({ personal, availability }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{personal.name}</h1>
          <p className="text-lg text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">
            {personal.title}
          </p>
        </div>
        {personal.open_to_work && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open to Work
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {personal.location}
        </span>
        <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <Mail className="w-3.5 h-3.5" /> {personal.email}
        </a>
        <a href={personal.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <GitBranch className="w-3.5 h-3.5" /> GitHub
        </a>
        <a href={personal.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <Link2 className="w-3.5 h-3.5" /> LinkedIn
        </a>
      </div>

      <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
        {personal.bio}
      </p>

      <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Seeking:</span>{" "}
            {availability.preferred_roles.join(" · ")}
          </span>
        </div>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {availability.work_arrangement.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-full text-indigo-700 dark:text-indigo-300">
              {a}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-full text-indigo-700 dark:text-indigo-300">
            {availability.notice_period} notice
          </span>
        </div>
      </div>
    </motion.section>
  );
}

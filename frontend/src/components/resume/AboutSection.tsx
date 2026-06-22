"use client";

import { PersonalInfo, Availability } from "@/lib/types";
import { MapPin, Mail, GitBranch, Link2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  personal: PersonalInfo;
  availability: Availability;
}

export default function AboutSection({ personal }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-ink tracking-display">{personal.name}</h1>
          <p className="text-lg text-ink-muted font-normal mt-1">
            {personal.title}
          </p>
        </div>
        {/* {personal.open_to_work && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Open to Work
          </span>
        )} */}
      </div>

      <div className="flex flex-wrap gap-3 mt-3 text-sm text-ink-subtle">
        <span className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> {personal.location}
        </span>
        <a href={`mailto:${personal.email}`} className="flex items-center gap-1 hover:text-ink transition-colors">
          <Mail className="w-3.5 h-3.5" /> {personal.email}
        </a>
        <a href={personal.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink transition-colors">
          <GitBranch className="w-3.5 h-3.5" /> GitHub
        </a>
        <a href={personal.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink transition-colors">
          <Link2 className="w-3.5 h-3.5" /> LinkedIn
        </a>
      </div>

      <p className="mt-4 text-ink-muted leading-relaxed text-sm">
        {personal.bio}
      </p>

      {/* <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100"> */}
        {/* <div className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-gray-700">
            <span className="font-medium">Seeking:</span>{" "}
            {availability.preferred_roles.join(" · ")}
          </span>
        </div>
        <div className="flex gap-2 mt-1.5 flex-wrap">
          {availability.work_arrangement.map((a) => (
            <span key={a} className="text-xs px-2 py-0.5 bg-white border border-indigo-200 rounded-full text-indigo-700">
              {a}
            </span>
          ))}
          <span className="text-xs px-2 py-0.5 bg-white border border-indigo-200 rounded-full text-indigo-700">
            {availability.notice_period} notice
          </span>
        </div> */}
      {/* </div> */}
    </motion.section>
  );
}

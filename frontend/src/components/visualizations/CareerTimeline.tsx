"use client";

import { motion } from "framer-motion";
import { Job, Education } from "@/lib/types";

interface TimelineItem {
  year: number;
  title: string;
  subtitle: string;
  type: "work" | "education";
}

interface Props {
  experience: Job[];
  education: Education[];
}

function parseYear(period: string): number {
  const match = period.match(/(\d{4})/);
  return match ? parseInt(match[1]) : 2020;
}

export default function CareerTimeline({ experience, education }: Props) {
  const items: TimelineItem[] = [
    ...experience.map((j) => ({
      year: parseYear(j.period),
      title: j.role,
      subtitle: j.company,
      type: "work" as const,
    })),
    ...education.map((e) => ({
      year: parseYear(e.period),
      title: e.degree,
      subtitle: e.institution,
      type: "education" as const,
    })),
  ].sort((a, b) => b.year - a.year);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Career Timeline</h3>
      <div className="relative">
        {/* Line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="flex gap-4 pl-7 relative"
            >
              <div
                className={`absolute left-0.5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white dark:border-gray-900 ${
                  item.type === "work"
                    ? "bg-indigo-500 text-white"
                    : "bg-amber-400 text-amber-900"
                }`}
              >
                {item.type === "work" ? "W" : "E"}
              </div>
              <div>
                <div className="text-xs text-gray-400 dark:text-gray-500">{item.year}</div>
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

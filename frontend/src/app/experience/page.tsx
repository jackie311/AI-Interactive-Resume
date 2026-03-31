"use client";

import { useEffect, useState } from "react";
import { fetchResume } from "@/lib/api";
import { Briefcase, GraduationCap } from "lucide-react";

interface Experience {
  company: string;
  role: string;
  period: string;
  start: string;
  location: string;
  description: string;
  highlights: string[];
  tech: string[];
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  highlights: string[];
}

interface ResumeData {
  experience: Experience[];
  education: Education[];
}

export default function TimelinePage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume()
      .then(setResume)
      .catch(() => setResume(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-24">Loading...</div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center text-gray-400 py-24">Failed to load timeline.</div>
    );
  }

  const items: { type: "work" | "edu"; year: string; content: Experience | Education }[] = [
    ...resume.experience.map((e) => ({
      type: "work" as const,
      year: e.period.split(" - ")[0],
      content: e,
    })),
    ...resume.education.map((e) => ({
      type: "edu" as const,
      year: e.period.split(" - ")[0],
      content: e,
    })),
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900">Career Timeline</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Work experience and education.
        </p>
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-10">
          {items.map((item, i) => {
            const isWork = item.type === "work";
            const work = isWork ? (item.content as Experience) : null;
            const edu = !isWork ? (item.content as Education) : null;

            return (
              <div key={i} className="relative pl-16">
                {/* dot */}
                <div
                  className={`absolute left-[18px] top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center
                    ${isWork
                      ? "bg-violet-600 border-violet-600"
                      : "bg-white border-gray-400"
                    }`}
                >
                  {isWork
                    ? <Briefcase className="w-2.5 h-2.5 text-white" />
                    : <GraduationCap className="w-2.5 h-2.5 text-gray-400" />
                  }
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  {/* header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 text-base">
                        {isWork ? work!.role : edu!.degree}
                      </div>
                      <div className="text-sm text-violet-600 font-medium mt-0.5">
                        {isWork ? work!.company : edu!.institution}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                        {isWork ? work!.period : edu!.period}
                      </div>
                      {isWork && (
                        <div className="text-xs text-gray-400 mt-1">{work!.location}</div>
                      )}
                    </div>
                  </div>

                  {/* highlights */}
                  <ul className="space-y-1.5 mb-4">
                    {(isWork ? work!.highlights : edu!.highlights).map((h, j) => (
                      <li key={j} className="flex gap-2 text-sm text-gray-600">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-400 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* tech tags */}
                  {isWork && work!.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {work!.tech.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 text-xs rounded-md bg-gray-100 text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

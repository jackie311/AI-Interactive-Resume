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
      <div className="text-center text-ink-subtle py-24">Loading...</div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center text-ink-subtle py-24">Failed to load timeline.</div>
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
        <h1 className="text-2xl font-semibold tracking-display text-ink">Career Timeline</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          Work experience and education.
        </p>
      </div>

      <div className="relative">
        {/* vertical line — thinner on mobile */}
        <div className="absolute left-3 sm:left-6 top-0 bottom-0 w-px bg-hairline" />

        <div className="space-y-8 sm:space-y-10">
          {items.map((item, i) => {
            const isWork = item.type === "work";
            const work = isWork ? (item.content as Experience) : null;
            const edu = !isWork ? (item.content as Education) : null;

            return (
              <div key={i} className="relative pl-8 sm:pl-16">
                {/* dot — smaller on mobile */}
                <div
                  className={`absolute left-[4px] sm:left-[18px] top-1 w-4 h-4 sm:w-[18px] sm:h-[18px] rounded-full border-2 flex items-center justify-center
                    ${isWork
                      ? "bg-primary border-primary"
                      : "bg-surface-2 border-hairline-strong"
                    }`}
                >
                  {isWork
                    ? <Briefcase className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-on-primary" />
                    : <GraduationCap className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-ink-subtle" />
                  }
                </div>

                <div className="bg-surface-1 rounded-xl border border-hairline p-4 sm:p-5">
                  {/* header */}
                  <div className="mb-3">
                    {/* role / degree + company / institution */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-semibold text-ink text-base leading-snug">
                          {isWork ? work!.role : edu!.degree}
                        </div>
                        <div className="text-sm text-primary font-medium mt-0.5">
                          {isWork ? work!.company : edu!.institution}
                        </div>
                      </div>
                      {/* period badge — hidden on mobile, shown on sm+ */}
                      <div className="hidden sm:block text-right shrink-0">
                        <div className="text-xs font-medium text-ink-subtle bg-surface-2 px-2.5 py-1 rounded-md whitespace-nowrap">
                          {isWork ? work!.period : edu!.period}
                        </div>
                        {isWork && (
                          <div className="text-xs text-ink-subtle mt-1">{work!.location}</div>
                        )}
                      </div>
                    </div>
                    {/* period + location on mobile — shown below title */}
                    <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                      <span className="text-xs font-medium text-ink-subtle bg-surface-2 px-2 py-0.5 rounded-md">
                        {isWork ? work!.period : edu!.period}
                      </span>
                      {isWork && work!.location && (
                        <span className="text-xs text-ink-subtle">{work!.location}</span>
                      )}
                    </div>
                  </div>

                  {/* highlights */}
                  <ul className="space-y-1.5 mb-4">
                    {(isWork ? work!.highlights : edu!.highlights).map((h, j) => (
                      <li key={j} className="flex gap-2 text-sm text-ink-muted">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
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
                          className="px-2 py-0.5 text-xs rounded-md bg-surface-2 text-ink-subtle border border-hairline"
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

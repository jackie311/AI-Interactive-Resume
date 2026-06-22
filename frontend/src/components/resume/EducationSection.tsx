"use client";

import { Education, Certification } from "@/lib/types";
import { GraduationCap, Award } from "lucide-react";

interface Props {
  education: Education[];
  certifications: Certification[];
}

export default function EducationSection({ education, certifications }: Props) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Education
      </h2>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-surface-1 border border-hairline flex gap-3"
          >
            <div className="w-8 h-8 rounded-md bg-surface-3 border border-hairline flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-ink-subtle" />
            </div>
            <div>
              <h3 className="font-semibold text-ink text-sm">{edu.degree}</h3>
              <p className="text-xs text-ink-subtle mt-1">
                {edu.institution} · {edu.period}
                {edu.gpa && <span className="ml-2 text-ink-tertiary">GPA: {edu.gpa}</span>}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {edu.highlights.map((h, j) => (
                  <li key={j} className="text-xs text-ink-subtle flex gap-1.5">
                    <span className="text-primary shrink-0">▸</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {certifications.length > 0 && (
        <>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-ink-tertiary mb-2 mt-5">
            Certifications
          </h3>
          <div className="space-y-2">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-1 border border-hairline"
              >
                <div className="w-7 h-7 rounded-md bg-surface-3 border border-hairline flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-ink-subtle" />
                </div>
                <div className="text-sm">
                  <span className="text-ink font-medium text-xs">{cert.name}</span>
                  <span className="text-ink-tertiary ml-2 text-xs">{cert.issuer} · {cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

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
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2.5 uppercase tracking-widest">
        <span className="w-1 h-4 gradient-bar rounded-full inline-block" />
        Education
      </h2>

      <div className="space-y-3">
        {education.map((edu, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white border border-black/[0.06] flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{edu.degree}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {edu.institution} · {edu.period}
                {edu.gpa && <span className="ml-2 text-gray-400">GPA: {edu.gpa}</span>}
              </p>
              <ul className="mt-1.5 space-y-0.5">
                {edu.highlights.map((h, j) => (
                  <li key={j} className="text-xs text-gray-500 flex gap-1.5">
                    <span className="text-indigo-400 shrink-0">▸</span>
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
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 mt-5">
            Certifications
          </h3>
          <div className="space-y-2">
            {certifications.map((cert, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-black/[0.06]"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="text-sm">
                  <span className="text-gray-800 font-medium text-xs">{cert.name}</span>
                  <span className="text-gray-400 ml-2 text-xs">{cert.issuer} · {cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

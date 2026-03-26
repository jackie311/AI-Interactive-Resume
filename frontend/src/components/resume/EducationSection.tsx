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
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
        Education
      </h2>

      {education.map((edu, i) => (
        <div key={i} className="mb-4 flex gap-3">
          <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{edu.degree}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {edu.institution} · {edu.period}
              {edu.gpa && <span className="ml-2 text-gray-400">GPA: {edu.gpa}</span>}
            </p>
            <ul className="mt-1 space-y-0.5">
              {edu.highlights.map((h, j) => (
                <li key={j} className="text-xs text-gray-500 dark:text-gray-400">▸ {h}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {certifications.length > 0 && (
        <>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 mt-4">
            Certifications
          </h3>
          <div className="space-y-2">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{cert.name}</span>
                  <span className="text-gray-400 ml-2">{cert.issuer} · {cert.year}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

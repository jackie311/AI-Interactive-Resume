"use client";

import { useEffect, useState } from "react";
import { fetchResume } from "@/lib/api";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillRadar {
  category: string;
  score: number;
}

interface Language {
  name: string;
  level: number;
  years: number;
}

interface ResumeSkills {
  languages: Language[];
  ai_ml: string[];
  backend: string[];
  frontend: string[];
  databases: string[];
  devops_cloud: string[];
}

interface ResumeSkillsWithRadar extends ResumeSkills {
  skill_radar: SkillRadar[];
}

interface ResumeData {
  skills: ResumeSkillsWithRadar;
}

const TECH_GROUPS = [
  { key: "ai_ml", label: "AI / LLM", color: "bg-violet-100 text-violet-800" },
  { key: "backend", label: "Backend", color: "bg-blue-100 text-blue-800" },
  { key: "frontend", label: "Frontend", color: "bg-cyan-100 text-cyan-800" },
  { key: "databases", label: "Databases", color: "bg-emerald-100 text-emerald-800" },
  { key: "devops_cloud", label: "Cloud & DevOps", color: "bg-amber-100 text-amber-800" },
];

export default function StatsPage() {
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
      <div className="text-center text-gray-400 py-24">Failed to load skills.</div>
    );
  }

  const { skills } = resume;
  const { skill_radar, ...restSkills } = skills;
  const skillsForTags = restSkills as ResumeSkills;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Skill coverage and tech stack.
        </p>
      </div>

      {/* Radar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Skill Coverage</h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={skill_radar}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />
            <Radar
              dataKey="score"
              stroke="#7c3aed"
              fill="#7c3aed"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(v) => [`${v} / 100`, "Score"]}
              contentStyle={{
                backgroundColor: "var(--tooltip-bg, #fff)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Tech stack tags */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Tech Stack</h2>
        <div className="space-y-5">
          {TECH_GROUPS.map(({ key, label, color }) => {
            const items = skillsForTags[key as keyof ResumeSkills] as string[];
            return (
              <div key={key}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${color}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

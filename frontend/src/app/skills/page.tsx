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
  { key: "ai_ml", label: "AI / LLM" },
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "databases", label: "Databases" },
  { key: "devops_cloud", label: "Cloud & DevOps" },
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
      <div className="text-center text-ink-subtle py-24">Loading...</div>
    );
  }

  if (!resume) {
    return (
      <div className="text-center text-ink-subtle py-24">Failed to load skills.</div>
    );
  }

  const { skills } = resume;
  const { skill_radar, ...restSkills } = skills;
  const skillsForTags = restSkills as ResumeSkills;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-display text-ink">Skills</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          Skill coverage and tech stack.
        </p>
      </div>

      {/* Radar chart */}
      <div className="bg-surface-1 rounded-xl border border-hairline p-6">
        <h2 className="text-sm font-semibold text-ink-muted mb-4">Skill Coverage</h2>
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={skill_radar}>
            <PolarGrid stroke="#23252a" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#8a8f98" }}
            />
            <Radar
              dataKey="score"
              stroke="#5e6ad2"
              fill="#5e6ad2"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              formatter={(v) => [`${v} / 100`, "Score"]}
              contentStyle={{
                backgroundColor: "#16171a",
                border: "1px solid #313337",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#f7f8f8",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Tech stack tags */}
      <div className="bg-surface-1 rounded-xl border border-hairline p-6">
        <h2 className="text-sm font-semibold text-ink-muted mb-5">Tech Stack</h2>
        <div className="space-y-5">
          {TECH_GROUPS.map(({ key, label }) => {
            const items = skillsForTags[key as keyof ResumeSkills] as string[];
            return (
              <div key={key}>
                <div className="text-xs font-semibold text-ink-tertiary uppercase tracking-wider mb-2">
                  {label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface-2 text-ink-subtle border border-hairline"
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

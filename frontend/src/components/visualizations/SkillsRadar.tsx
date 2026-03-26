"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { RadarEntry } from "@/lib/types";

interface Props {
  data: RadarEntry[];
}

export default function SkillsRadar({ data }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Skill Proficiency</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#6b7280", fontSize: 11 }}
          />
          <Radar
            name="Skill"
            dataKey="score"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Proficiency"]}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              fontSize: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

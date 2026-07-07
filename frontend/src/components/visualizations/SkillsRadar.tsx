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
    <div className="bg-surface-1 rounded-xl border border-hairline p-4">
      <h3 className="text-sm font-semibold text-ink-muted mb-3">Skill Proficiency</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#d7cdb9" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#6d685f", fontSize: 11 }}
          />
          <Radar
            name="Skill"
            dataKey="score"
            stroke="#cc785c"
            fill="#cc785c"
            fillOpacity={0.28}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Proficiency"]}
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d7cdb9",
              borderRadius: "8px",
              fontSize: 12,
              color: "#141413",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

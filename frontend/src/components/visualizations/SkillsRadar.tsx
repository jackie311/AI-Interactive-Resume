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
          <PolarGrid stroke="#23252a" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#8a8f98", fontSize: 11 }}
          />
          <Radar
            name="Skill"
            dataKey="score"
            stroke="#5e6ad2"
            fill="#5e6ad2"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Proficiency"]}
            contentStyle={{
              backgroundColor: "#16171a",
              border: "1px solid #313337",
              borderRadius: "8px",
              fontSize: 12,
              color: "#f7f8f8",
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

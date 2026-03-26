"use client";

import { useEffect, useState } from "react";
import { fetchGithubStats } from "@/lib/api";
import { GitBranch, Star, GitFork, Code2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#14b8a6"];

export default function StatsPage() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGithubStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Developer Stats</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          GitHub activity and language breakdown.
        </p>
      </div>

      {loading && (
        <div className="text-center text-gray-400 dark:text-gray-500 py-12">Loading stats...</div>
      )}

      {!loading && stats ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Public Repos", value: stats.public_repos as number, icon: <GitBranch className="w-5 h-5" /> },
              { label: "Total Stars", value: stats.total_stars as number, icon: <Star className="w-5 h-5" /> },
              { label: "Total Forks", value: stats.total_forks as number, icon: <GitFork className="w-5 h-5" /> },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Language chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Language Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.languages as { name: string; percentage: number }[]}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} ${(entry.percent ? (entry.percent * 100).toFixed(1) : 0)}%`}
                  labelLine={true}
                >
                  {(stats.languages as unknown[]).map((_: unknown, i: number) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : !loading && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
          <p className="text-amber-800 dark:text-amber-400 text-sm">
            GitHub stats unavailable. Set <code className="font-mono">GITHUB_TOKEN</code> and{" "}
            <code className="font-mono">GITHUB_USERNAME</code> in the backend <code>.env</code>.
          </p>
        </div>
      )}
    </div>
  );
}

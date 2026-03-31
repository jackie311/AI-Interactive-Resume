"use client";

import { useEffect, useState } from "react";
import { fetchChatStats } from "@/lib/api";

export default function ChatStatsBadge() {
  const [stats, setStats] = useState<{ total_questions: number; total_conversations: number } | null>(null);

  useEffect(() => {
    fetchChatStats().then(setStats).catch(() => null);
  }, []);

  if (!stats) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>
        {stats.total_conversations.toLocaleString()} conversations ·{" "}
        {stats.total_questions.toLocaleString()} questions asked
      </span>
    </div>
  );
}

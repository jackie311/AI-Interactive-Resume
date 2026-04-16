"use client";

import { useState } from "react";
import { FileText, MessageCircle } from "lucide-react";

export default function HomeLayout({
  resumePanel,
  chatPanel,
}: {
  resumePanel: React.ReactNode;
  chatPanel: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"resume" | "chat">("resume");

  return (
    <>
      {/* ── Desktop: side-by-side (lg+) ── */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto min-w-0">{resumePanel}</div>
        <div className="w-[360px] shrink-0 flex flex-col overflow-hidden">{chatPanel}</div>
      </div>

      {/* ── Mobile / Tablet: tab layout ── */}
      <div className="flex lg:hidden flex-col flex-1 overflow-hidden">
        {/* Content area */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className={`absolute inset-0 overflow-y-auto ${
              activeTab === "resume" ? "block" : "hidden"
            }`}
          >
            {resumePanel}
          </div>
          <div
            className={`absolute inset-0 flex flex-col ${
              activeTab === "chat" ? "flex" : "hidden"
            }`}
          >
            {chatPanel}
          </div>
        </div>

        {/* Bottom tab bar */}
        <div className="shrink-0 border-t border-black/[0.06] bg-white flex">
          {(
            [
              { id: "resume", label: "Resume", Icon: FileText },
              { id: "chat",   label: "Ask AI",  Icon: MessageCircle },
            ] as const
          ).map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors ${
                activeTab === id ? "text-violet-600" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
              {activeTab === id && (
                <span className="absolute top-0 left-4 right-4 h-0.5 bg-violet-600 rounded-b-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

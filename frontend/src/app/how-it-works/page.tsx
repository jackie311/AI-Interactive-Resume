"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Database, Cpu, MessageSquare, FileText, Layers, Users, MessagesSquare } from "lucide-react";
import { fetchChatStats } from "@/lib/api";

const PIPELINE_STEPS = [
  {
    icon: FileText,
    label: "Source Data",
    detail: "resume.yaml + projects.yaml",
    color: "bg-surface-1 border-hairline text-ink",
    iconColor: "text-ink-subtle",
  },
  {
    icon: Cpu,
    label: "Embeddings",
    detail: "HuggingFace all-MiniLM-L6-v2",
    color: "bg-surface-1 border-hairline text-ink",
    iconColor: "text-ink-subtle",
  },
  {
    icon: Database,
    label: "Vector Store",
    detail: "ChromaDB on EC2 EBS",
    color: "bg-surface-1 border-hairline text-ink",
    iconColor: "text-ink-subtle",
  },
  {
    icon: Layers,
    label: "LLM",
    detail: "Claude claude-sonnet-4-6 via LangChain",
    color: "bg-primary border-primary text-on-primary",
    iconColor: "text-on-primary",
  },
  {
    icon: MessageSquare,
    label: "Streaming API",
    detail: "FastAPI SSE → Next.js chat UI",
    color: "bg-surface-1 border-hairline text-ink",
    iconColor: "text-ink-subtle",
  },
];

const TECH_CHOICES = [
  {
    name: "Claude API",
    why: "Best-in-class instruction-following and multilingual (EN/ZH) capability. Streaming via Anthropic SDK integrates cleanly with FastAPI SSE.",
    category: "LLM",
    color: "border-l-hairline-strong",
  },
  {
    name: "ChromaDB",
    why: "Lightweight, embeddable vector DB — no separate service needed. Persisted on AWS EFS so it survives container restarts without re-embedding on every deploy.",
    category: "Vector DB",
    color: "border-l-hairline-strong",
  },
  {
    name: "HuggingFace all-MiniLM-L6-v2",
    why: "Fast, small (80MB), runs CPU-only on EC2. Good semantic similarity for resume-style factual retrieval without needing a paid embedding API.",
    category: "Embeddings",
    color: "border-l-hairline-strong",
  },
  {
    name: "LangChain",
    why: "Handles chunking, retrieval chain wiring, and history management. Swappable components — easy to upgrade models or vector stores without rewriting retrieval logic.",
    category: "Orchestration",
    color: "border-l-hairline-strong",
  },
  {
    name: "FastAPI + SSE",
    why: "Async-native Python, minimal overhead. Server-Sent Events keep the connection simple — no WebSocket handshake — and stream tokens to the browser as they arrive.",
    category: "Backend",
    color: "border-l-hairline-strong",
  },
  {
    name: "AWS EC2 t2.micro",
    why: "Free-tier eligible (12 months). Runs Docker Compose directly — no orchestration overhead. ChromaDB persisted on EBS volume, survives container restarts without EFS complexity.",
    category: "Infra",
    color: "border-l-hairline-strong",
  },
];

const AWS_COMPONENTS = [
  { name: "CloudFront + S3", role: "CDN + static hosting for Next.js export", icon: "🌐" },
  { name: "EC2 t2.micro", role: "Docker host running FastAPI backend (free tier)", icon: "⚙️" },
  { name: "EBS", role: "Persistent disk — ChromaDB Docker volume survives restarts", icon: "💾" },
  { name: "Elastic IP", role: "Static public IP for EC2, used as CloudFront origin", icon: "🔌" },
  { name: "ACM", role: "Wildcard TLS cert (*.jackiejin.dev) for CloudFront HTTPS", icon: "🔐" },
  { name: "CloudFront Function", role: "Rewrites paths like /experience → /experience.html", icon: "⚡" },
];

export default function AIPage() {
  const [stats, setStats] = useState<{ total_questions: number; total_conversations: number } | null>(null);

  useEffect(() => {
    fetchChatStats().then(setStats).catch(() => null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-display text-ink">AI Engineering</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          How this portfolio works — RAG pipeline, tech choices, and AWS architecture.
        </p>
      </div>

      {/* RAG Pipeline */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted mb-5 uppercase tracking-wider">
          RAG Pipeline
        </h2>
        <div className="bg-surface-1 rounded-xl border border-hairline p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-x-0 sm:gap-y-3 flex-wrap">
            {PIPELINE_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-2 sm:gap-0">
                  <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border ${step.color} min-w-0`}>
                    <Icon className={`w-4 h-4 shrink-0 ${step.iconColor}`} />
                    <div>
                      <div className="text-xs font-semibold whitespace-nowrap">{step.label}</div>
                      <div className="text-[10px] opacity-70 whitespace-nowrap">{step.detail}</div>
                    </div>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-ink-tertiary shrink-0 mx-1 sm:mx-2" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-hairline text-sm text-ink-subtle leading-relaxed">
            Resume YAML is chunked and embedded offline into ChromaDB (persisted on EC2 EBS). At query time,
            the top-4 relevant chunks are retrieved and injected into the Claude prompt as grounding context —
            so the AI answers as Jackie, citing real facts, not hallucinations.
            Responses stream token-by-token via SSE to the chat panel.
          </div>
        </div>
      </section>

      {/* Tech choices */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted mb-5 uppercase tracking-wider">
          Why Each Tech
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECH_CHOICES.map((t) => (
            <div key={t.name}
              className={`bg-surface-1 rounded-xl border border-hairline border-l-4 ${t.color} p-4`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-ink">{t.name}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-3 text-ink-subtle">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-ink-subtle leading-relaxed">{t.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AWS Architecture */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted mb-5 uppercase tracking-wider">
          AWS Architecture
        </h2>

        {/* Flow diagram */}
        <div className="bg-surface-1 rounded-xl border border-hairline p-6 mb-4">
          <div className="flex flex-col items-center gap-1 text-sm">
            {/* Browser */}
            <div className="px-4 py-2 rounded-lg bg-surface-3 text-ink-muted font-medium text-xs">
              Browser
            </div>
            <div className="w-px h-4 bg-hairline" />

            {/* CloudFront */}
            <div className="px-4 py-2 rounded-lg bg-primary border border-primary text-on-primary font-medium text-xs">
              CloudFront CDN
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-hairline" />
                <div className="text-[10px] text-ink-tertiary">static</div>
                <div className="w-px h-4 bg-hairline" />
                <div className="px-3 py-1.5 rounded-lg bg-surface-3 border border-hairline text-ink-muted font-medium text-xs whitespace-nowrap">
                  S3 (Next.js)
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-hairline" />
                <div className="text-[10px] text-ink-tertiary">/api/*</div>
                <div className="w-px h-4 bg-hairline" />
                <div className="px-3 py-1.5 rounded-lg bg-surface-3 border border-hairline text-ink-muted font-medium text-xs whitespace-nowrap">
                  EC2 t2.micro (Docker)
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-3 bg-hairline" />
                    <div className="px-2.5 py-1 rounded-lg bg-surface-4 border border-hairline text-ink-subtle font-medium text-[10px]">
                      EBS (ChromaDB)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {AWS_COMPONENTS.map((c) => (
            <div key={c.name}
              className="bg-surface-1 rounded-xl border border-hairline p-4 flex gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <div className="text-sm font-semibold text-ink">{c.name}</div>
                <div className="text-xs text-ink-subtle mt-0.5 leading-relaxed">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Stats */}
      <section>
        <h2 className="text-sm font-semibold text-ink-muted mb-5 uppercase tracking-wider">
          Live Stats
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-1 rounded-xl border border-hairline p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-3 border border-hairline flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-ink">
                {stats ? stats.total_conversations.toLocaleString() : "—"}
              </div>
              <div className="text-xs text-ink-subtle mt-0.5">Conversations started</div>
            </div>
          </div>
          <div className="bg-surface-1 rounded-xl border border-hairline p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-surface-3 border border-hairline flex items-center justify-center shrink-0">
              <MessagesSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-semibold text-ink">
                {stats ? stats.total_questions.toLocaleString() : "—"}
              </div>
              <div className="text-xs text-ink-subtle mt-0.5">Questions asked</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

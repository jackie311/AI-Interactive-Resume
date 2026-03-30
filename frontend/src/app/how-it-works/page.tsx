"use client";

import { ArrowRight, Database, Cpu, Cloud, MessageSquare, FileText, Layers } from "lucide-react";

const PIPELINE_STEPS = [
  {
    icon: FileText,
    label: "Source Data",
    detail: "resume.yaml + projects.yaml",
    color: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Cpu,
    label: "Embeddings",
    detail: "HuggingFace all-MiniLM-L6-v2",
    color: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Database,
    label: "Vector Store",
    detail: "ChromaDB on AWS EFS",
    color: "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-400",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Layers,
    label: "LLM",
    detail: "Claude claude-sonnet-4-6 via LangChain",
    color: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30 text-orange-700 dark:text-orange-400",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    icon: MessageSquare,
    label: "Streaming API",
    detail: "FastAPI SSE → Next.js chat UI",
    color: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const TECH_CHOICES = [
  {
    name: "Claude API",
    why: "Best-in-class instruction-following and multilingual (EN/ZH) capability. Streaming via Anthropic SDK integrates cleanly with FastAPI SSE.",
    category: "LLM",
    color: "border-l-orange-400",
  },
  {
    name: "ChromaDB",
    why: "Lightweight, embeddable vector DB — no separate service needed. Persisted on AWS EFS so it survives container restarts without re-embedding on every deploy.",
    category: "Vector DB",
    color: "border-l-violet-400",
  },
  {
    name: "HuggingFace all-MiniLM-L6-v2",
    why: "Fast, small (80MB), runs CPU-only in Fargate. Good semantic similarity for resume-style factual retrieval without needing a paid embedding API.",
    category: "Embeddings",
    color: "border-l-blue-400",
  },
  {
    name: "LangChain",
    why: "Handles chunking, retrieval chain wiring, and history management. Swappable components — easy to upgrade models or vector stores without rewriting retrieval logic.",
    category: "Orchestration",
    color: "border-l-cyan-400",
  },
  {
    name: "FastAPI + SSE",
    why: "Async-native Python, minimal overhead. Server-Sent Events keep the connection simple — no WebSocket handshake — and stream tokens to the browser as they arrive.",
    category: "Backend",
    color: "border-l-emerald-400",
  },
  {
    name: "AWS ECS Fargate",
    why: "Serverless containers — no EC2 to manage. Scales to zero when idle, spins up in seconds. Paired with EFS for persistent ChromaDB storage across deployments.",
    category: "Infra",
    color: "border-l-amber-400",
  },
];

const AWS_COMPONENTS = [
  { name: "CloudFront + S3", role: "CDN + static hosting for Next.js export", icon: "🌐" },
  { name: "ECS Fargate", role: "Serverless container running FastAPI backend", icon: "⚙️" },
  { name: "EFS", role: "Persistent filesystem — ChromaDB survives redeploys", icon: "💾" },
  { name: "ECR", role: "Docker image registry for backend container", icon: "📦" },
  { name: "ALB", role: "Load balancer — routes /api/* from CloudFront to ECS", icon: "⚖️" },
  { name: "Secrets Manager", role: "ANTHROPIC_API_KEY, GITHUB_TOKEN at runtime", icon: "🔐" },
];

export default function AIPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Engineering</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          How this portfolio works — RAG pipeline, tech choices, and AWS architecture.
        </p>
      </div>

      {/* RAG Pipeline */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-wider">
          RAG Pipeline
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
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
                    <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mx-1 sm:mx-2" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Resume YAML is chunked and embedded offline into ChromaDB (persisted on EFS). At query time,
            the top-4 relevant chunks are retrieved and injected into the Claude prompt as grounding context —
            so the AI answers as Jackie, citing real facts, not hallucinations.
            Responses stream token-by-token via SSE to the chat panel.
          </div>
        </div>
      </section>

      {/* Tech choices */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-wider">
          Why Each Tech
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECH_CHOICES.map((t) => (
            <div key={t.name}
              className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 border-l-4 ${t.color} p-4`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">{t.name}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  {t.category}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.why}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AWS Architecture */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5 uppercase tracking-wider">
          AWS Architecture
        </h2>

        {/* Flow diagram */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-4">
          <div className="flex flex-col items-center gap-1 text-sm">
            {/* Browser */}
            <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-xs">
              Browser
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />

            {/* CloudFront */}
            <div className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-medium text-xs">
              CloudFront CDN
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="text-[10px] text-gray-400">static</div>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 font-medium text-xs whitespace-nowrap">
                  S3 (Next.js)
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="text-[10px] text-gray-400">/api/*</div>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium text-xs">
                  ALB
                </div>
                <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                <div className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-medium text-xs whitespace-nowrap">
                  ECS Fargate
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-400 font-medium text-[10px]">
                      EFS (ChromaDB)
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
                    <div className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 font-medium text-[10px]">
                      Secrets Manager
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
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { streamChat } from "@/lib/api";
import { Sparkles, ClipboardPaste, RotateCcw, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const PROMPT_PREFIX = `Please analyze the following job description and assess how well Jackie fits this role. Structure your response with:
1. **Overall Fit** — a brief overall assessment
2. **Strengths** — where Jackie's background aligns well
3. **Gaps** — any requirements Jackie doesn't fully meet
4. **Suggested Talking Points** — 2-3 things Jackie should highlight in an interview

Job Description:
`;

const EXAMPLE_JD = `Senior AI Engineer

We are looking for a Senior AI Engineer to join our team. You will be responsible for:
- Designing and building LLM-powered applications and RAG pipelines
- Integrating AI models (OpenAI, Anthropic) into production systems
- Working with Python, FastAPI, and cloud infrastructure (AWS)
- Collaborating with frontend teams on full-stack AI features

Requirements:
- 3+ years of software engineering experience
- Experience with LLMs, prompt engineering, and vector databases
- Python proficiency (FastAPI, LangChain or similar)
- AWS experience (ECS, S3, Lambda)
- Strong communication skills`;

export default function JDAnalyzerPage() {
  const [jd, setJd] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [result]);

  const analyze = async () => {
    if (!jd.trim() || loading) return;
    setResult("");
    setDone(false);
    setLoading(true);

    try {
      const message = PROMPT_PREFIX + jd.trim();
      for await (const chunk of streamChat(message, [])) {
        setResult((prev) => prev + chunk);
      }
    } catch {
      setResult("Failed to analyze. Please check the backend is running.");
    } finally {
      setLoading(false);
      setDone(true);
    }
  };

  const reset = () => {
    setJd("");
    setResult("");
    setDone(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-display text-ink">JD Fit Analyzer</h1>
        <p className="text-ink-subtle mt-1 text-sm">
          Paste a job description — the AI will assess how well Jackie fits the role.
        </p>
      </div>

      {/* Input */}
      <div className="bg-surface-1 rounded-xl border border-hairline p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
            Job Description
          </span>
          <button
            onClick={() => setJd(EXAMPLE_JD)}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary-hover"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Load example
          </button>
        </div>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste a job description here..."
          rows={10}
          className="w-full text-sm text-ink bg-surface-2 border border-hairline rounded-md p-3 placeholder-ink-tertiary resize-none outline-none focus:border-primary-focus leading-relaxed"
        />
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-hairline">
          <span className="text-xs text-ink-subtle">{jd.length} characters</span>
          <div className="flex gap-2">
            {(result || jd) && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-ink-subtle hover:text-ink-muted hover:bg-surface-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={analyze}
              disabled={!jd.trim() || loading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-md bg-primary hover:bg-primary-hover text-on-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {loading ? "Analyzing..." : "Analyze Fit"}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      {(result || loading) && (
        <div
          ref={resultRef}
          className="bg-surface-1 rounded-xl border border-hairline p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-on-primary" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              AI Analysis
            </span>
            {loading && (
              <span className="ml-auto flex items-center gap-1 text-xs text-ink-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Streaming...
              </span>
            )}
          </div>
          <div className="prose prose-sm max-w-none text-ink-muted
            prose-headings:text-ink
            prose-strong:text-ink
            prose-li:text-ink-muted">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          {done && (
            <div className="mt-4 pt-3 border-t border-hairline text-xs text-ink-subtle">
              Analysis complete · Powered by Claude claude-sonnet-4-6 + RAG
            </div>
          )}
        </div>
      )}
    </div>
  );
}

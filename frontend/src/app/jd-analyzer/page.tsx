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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">JD Fit Analyzer</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          Paste a job description — the AI will assess how well Jackie fits the role.
        </p>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Job Description
          </span>
          <button
            onClick={() => setJd(EXAMPLE_JD)}
            className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 hover:underline"
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
          className="w-full text-sm text-gray-700 dark:text-gray-200 bg-transparent placeholder-gray-300 dark:placeholder-gray-600 resize-none outline-none leading-relaxed"
        />
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-gray-400">{jd.length} characters</span>
          <div className="flex gap-2">
            {(result || jd) && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            )}
            <button
              onClick={analyze}
              disabled={!jd.trim() || loading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
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
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              AI Analysis
            </span>
            {loading && (
              <span className="ml-auto flex items-center gap-1 text-xs text-violet-500">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                Streaming...
              </span>
            )}
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-li:text-gray-600 dark:prose-li:text-gray-400">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
          {done && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
              Analysis complete · Powered by Claude claude-sonnet-4-6 + RAG
            </div>
          )}
        </div>
      )}
    </div>
  );
}

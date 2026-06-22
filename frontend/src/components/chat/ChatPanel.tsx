"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { streamChat } from "@/lib/api";
import { Send, Bot, User, Briefcase } from "lucide-react";
import ReactMarkdown from "react-markdown";
import SuggestedQuestions from "./SuggestedQuestions";

const WELCOME = `Hi! I'm Jackie's AI assistant — and yes, this chat is itself part of Jackie's work, built with RAG, ChromaDB, and Claude API.

Ask me about Jackie's AI/LLM experience, projects, or tech stack — in English or Chinese! 👋

Try: "What AI systems have you built?" or "Tell me about your RAG pipeline"`;

export default function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recruiterMode, setRecruiterMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: ChatMessage = { role: "user", content };
    const history = messages.filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0);

    setMessages((prev) => [...prev, userMsg, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);

    try {
      let assistantContent = "";
      for await (const chunk of streamChat(content, history, recruiterMode)) {
        assistantContent += chunk;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: assistantContent };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-full bg-surface-1 border-l border-hairline">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-hairline bg-surface-2 text-ink">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-on-primary">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none text-ink">Ask Jackie&apos;s AI</p>
              <p className="text-xs text-ink-subtle mt-1">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={() => setRecruiterMode((v) => !v)}
            title="Recruiter Mode: paste a JD and I'll analyze fit"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors font-medium border ${
              recruiterMode
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-1 text-ink-subtle border-hairline hover:text-ink hover:border-hairline-strong"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Recruiter
          </button>
        </div>
        {recruiterMode && (
          <p className="text-xs text-ink-subtle mt-2">
            Paste a job description and I&apos;ll analyze how Jackie fits the role.
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-3 text-ink-subtle border border-hairline"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-surface-2 border border-hairline text-ink-muted rounded-tl-sm"
                  : "bg-primary text-on-primary rounded-tr-sm"
              }`}
            >
              {msg.content ? (
                msg.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-1 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-1 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li>{children}</li>,
                      code: ({ children }) => <code className="bg-surface-4 border border-hairline rounded px-1 text-xs font-mono text-ink">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )
              ) : (
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <SuggestedQuestions onSelect={sendMessage} />
      )}

      {/* Input */}
      <div className="p-3 border-t border-hairline">
        <div className="flex gap-2 items-end bg-surface-2 border border-hairline rounded-md px-3 py-2 focus-within:border-primary-focus transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={
              recruiterMode
                ? "Paste a job description here..."
                : "Ask me anything... (Enter to send)"
            }
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-ink placeholder-ink-tertiary max-h-28 overflow-y-auto"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-1.5 rounded-md bg-primary text-on-primary disabled:opacity-30 hover:bg-primary-hover transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

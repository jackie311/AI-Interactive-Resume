"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/lib/types";
import { streamChat } from "@/lib/api";
import { Send, Bot, User, Briefcase } from "lucide-react";
import SuggestedQuestions from "./SuggestedQuestions";

const WELCOME = `Hi! I'm Jackie's AI assistant. Ask me anything about Jackie's experience, skills, or projects — in English or Chinese! 👋

Try: "What's your strongest project?" or "你会 Python 吗？"`;

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
      for await (const chunk of streamChat(content, history)) {
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
    <div className="flex flex-col h-full bg-white dark:bg-[#0d0d16] border-l border-black/[0.06] dark:border-white/[0.06]">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-black/[0.06] dark:border-white/[0.06] bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Bot className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-none">Ask Jackie&apos;s AI</p>
              <p className="text-xs text-indigo-200 mt-0.5">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={() => setRecruiterMode((v) => !v)}
            title="Recruiter Mode: paste a JD and I'll analyze fit"
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-all font-semibold ${
              recruiterMode
                ? "bg-amber-400 text-amber-900 shadow-lg shadow-amber-500/30"
                : "bg-white/15 text-white hover:bg-white/25"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Recruiter
          </button>
        </div>
        {recruiterMode && (
          <p className="text-xs text-indigo-200 mt-2">
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
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                  : "bg-gray-100 dark:bg-white/[0.08] text-gray-600 dark:text-gray-300"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5" />
              ) : (
                <User className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-gray-50 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.07] text-gray-800 dark:text-gray-200 rounded-tl-sm"
                  : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-violet-500/20"
              }`}
            >
              {msg.content || (
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
      <div className="p-3 border-t border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex gap-2 items-end bg-gray-50 dark:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.07] rounded-xl px-3 py-2 focus-within:border-violet-300 dark:focus-within:border-violet-500/40 transition-all">
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
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 max-h-28 overflow-y-auto"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white disabled:opacity-30 hover:from-violet-500 hover:to-indigo-500 transition-all shrink-0 shadow-md shadow-violet-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

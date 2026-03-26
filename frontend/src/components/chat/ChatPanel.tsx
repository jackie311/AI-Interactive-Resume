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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Ask Jackie's AI</p>
              <p className="text-xs text-indigo-200">Powered by Claude</p>
            </div>
          </div>
          <button
            onClick={() => setRecruiterMode((v) => !v)}
            title="Recruiter Mode: paste a JD and I'll analyze fit"
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors font-medium ${
              recruiterMode
                ? "bg-amber-400 text-amber-900"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Recruiter Mode
          </button>
        </div>
        {recruiterMode && (
          <p className="text-xs text-indigo-200 mt-1.5">
            Paste a job description and I'll analyze how Jackie fits the role.
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
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "assistant"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm"
                  : "bg-indigo-600 text-white rounded-tr-sm"
              }`}
            >
              {msg.content || (
                <span className="inline-flex gap-1">
                  <span className="animate-bounce delay-0">·</span>
                  <span className="animate-bounce delay-100">·</span>
                  <span className="animate-bounce delay-200">·</span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested questions (shown when only welcome message) */}
      {messages.length === 1 && (
        <SuggestedQuestions onSelect={sendMessage} />
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 items-end bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2">
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
            className="flex-1 bg-transparent resize-none outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 max-h-28 overflow-y-auto"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-1.5 rounded-lg bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

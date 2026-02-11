"use client";

import { useState, useRef, useEffect } from "react";
import { DAY_SCHEDULES } from "./schedule-data";

function BotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Hi! I'm your TechConf Assistant. Ask me anything about the schedule or speakers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const scheduleContext = JSON.stringify(DAY_SCHEDULES);
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, scheduleData: scheduleContext }),
      });

      const data = await res.json();
      const response = data.response || "I'm sorry, I couldn't process that.";

      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "I'm having trouble right now. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 hover:bg-emerald-600"
      >
        <BotIcon className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-end sm:p-6 bg-black/40 backdrop-blur-sm">
          <div className="w-full sm:w-[400px] h-[80vh] sm:h-[600px] bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-emerald-500/10">
              <div className="flex items-center gap-3">
                <BotIcon className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-white">Agenda Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center transition-colors"
              >
                <CloseIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 p-3 rounded-2xl animate-pulse text-slate-400">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about AI sessions..."
                className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-white placeholder-slate-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center disabled:opacity-50 transition-all active:scale-95 hover:bg-emerald-600"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

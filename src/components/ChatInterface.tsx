"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Languages } from "lucide-react";
import clsx from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  originalContent?: string;
  showOriginal?: boolean;
}

const demoResponses = [
  "Based on what you described, that repair can wait. Get a second quote before agreeing.",
  "That's a common upsell. Most cars don't need a coolant flush every visit.",
  "You're being overcharged. A fair price for that job is usually 30–40% less.",
];

export function ChatInterface() {
  const t = useTranslations("chat");
  const tCommon = useTranslations("common");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    await new Promise((r) => setTimeout(r, 1200));
    const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      originalContent: "Respuesta traducida del asesoramiento original de Asaad.",
    };
    setMessages((prev) => [...prev, assistantMsg]);
    setTyping(false);
  };

  const toggleTranslation = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, showOriginal: !m.showOriginal } : m)));
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-border bg-charcoal sm:h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-steel-light">
            <div>
              <p className="mb-2 text-lg font-medium">{t("welcome")}</p>
              <p className="text-sm">{t("emptyState")}</p>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
            <div className={clsx("max-w-[85%] rounded-2xl px-4 py-3", msg.role === "user" ? "bg-accent-red text-white" : "bg-background border border-border")}>
              <p>{msg.showOriginal && msg.originalContent ? msg.originalContent : msg.content}</p>
              {msg.role === "assistant" && msg.originalContent && (
                <button onClick={() => toggleTranslation(msg.id)} className="mt-2 flex items-center gap-1 text-xs text-accent-red hover:underline">
                  <Languages className="h-3 w-3" />
                  {msg.showOriginal ? tCommon("viewTranslated") : tCommon("viewOriginal")}
                </button>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-background border border-border px-4 py-3 text-steel-light">{t("typing")}</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={t("placeholder")} className="flex-1 rounded-xl border border-border bg-background px-4 py-3 focus:border-accent-red focus:outline-none" />
          <button onClick={sendMessage} disabled={!input.trim() || typing} className="rounded-xl bg-accent-red px-4 py-3 text-white transition-colors hover:bg-accent-red-dark disabled:opacity-50" aria-label={t("send")}>
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

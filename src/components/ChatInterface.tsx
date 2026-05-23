"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Send, Sparkles, Bot } from "lucide-react";
import { UpsellBanner } from "./UpsellBanner";
import clsx from "clsx";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isAi?: boolean;
  shouldEscalate?: boolean;
}

export function ChatInterface() {
  const t = useTranslations("chat");
  const locale = useLocale();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEscalation, setShowEscalation] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, showEscalation]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setShowEscalation(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, locale }),
      });
      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        isAi: true,
        shouldEscalate: data.shouldEscalate,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (data.shouldEscalate) setShowEscalation(true);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: t("errorFallback"),
          isAi: true,
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-charcoal px-4 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-red-glow">
          <Bot className="h-5 w-5 text-accent-red" />
        </div>
        <div>
          <p className="font-semibold">{t("miniAsaad")}</p>
          <p className="text-xs text-steel-light">{t("miniAsaadDesc")}</p>
        </div>
        <span className="ms-auto flex items-center gap-1 rounded-full bg-success/20 px-2 py-1 text-xs font-bold text-success">
          <Sparkles className="h-3 w-3" />
          {t("aiFree")}
        </span>
      </div>

      <div className="flex h-[calc(100vh-16rem)] flex-col rounded-2xl border border-border bg-charcoal sm:h-[560px]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-steel-light px-4">
              <Bot className="mb-4 h-12 w-12 text-accent-red opacity-50" />
              <p className="mb-2 text-lg font-medium">{t("welcome")}</p>
              <p className="mb-6 text-sm">{t("emptyState")}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[t("example1"), t("example2"), t("example3")].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:border-accent-red"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-4 py-3",
                  msg.role === "user"
                    ? "bg-accent-red text-white"
                    : "bg-background border border-border"
                )}
              >
                {msg.role === "assistant" && msg.isAi && (
                  <div className="mb-1 flex items-center gap-1 text-xs text-accent-red">
                    <Sparkles className="h-3 w-3" />
                    {t("miniAsaad")}
                  </div>
                )}
                <p>{msg.content}</p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-border bg-background px-4 py-3 text-steel-light">
                {t("typing")}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={t("placeholder")}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-3 focus:border-accent-red focus:outline-none"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || typing}
              className="rounded-xl bg-accent-red px-4 py-3 text-white transition-colors hover:bg-accent-red-dark disabled:opacity-50"
              aria-label={t("send")}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {showEscalation && (
        <UpsellBanner variant="highRisk" />
      )}

      {!showEscalation && messages.length >= 2 && (
        <UpsellBanner variant="chat" />
      )}
    </div>
  );
}

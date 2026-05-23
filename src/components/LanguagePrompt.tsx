"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LanguageSelector } from "./LanguageSelector";
import { Shield } from "lucide-react";

const STORAGE_KEY = "asaad-language-selected";

export function LanguagePrompt() {
  const t = useTranslations("languagePrompt");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const selected = localStorage.getItem(STORAGE_KEY);
    if (!selected) {
      setVisible(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-charcoal p-8 shadow-2xl glow-red">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-accent-red-glow p-4">
            <Shield className="h-10 w-10 text-accent-red" />
          </div>
        </div>
        <h2 className="mb-2 text-center text-2xl font-bold">{t("title")}</h2>
        <p className="mb-8 text-center text-steel-light">{t("subtitle")}</p>
        <div className="mb-8 flex justify-center">
          <LanguageSelector />
        </div>
        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-accent-red py-4 text-lg font-semibold text-white transition-colors hover:bg-accent-red-dark"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}

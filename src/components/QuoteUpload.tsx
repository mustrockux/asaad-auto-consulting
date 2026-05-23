"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { BigButton } from "./BigButton";
import { analyzeQuote, type QuoteAnalysis } from "@/lib/services";
import { Upload, FileText, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";

export function QuoteUpload() {
  const t = useTranslations("quote");
  const tCommon = useTranslations("common");
  const [mode, setMode] = useState<"upload" | "text">("upload");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<QuoteAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    const sampleText =
      text ||
      "Brake pad replacement $320, Oil change $65, Coolant flush $149, Fuel injection cleaning $189. Total: $723";
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setResults(analyzeQuote(sampleText));
    setAnalyzing(false);
  };

  const urgencyLabels = {
    now: t("urgencyNow"),
    soon: t("urgencySoon"),
    later: t("urgencyLater"),
  };

  const verdictLabels = {
    fair: t("verdictFair"),
    high: t("verdictHigh"),
    low: t("verdictLow"),
  };

  return (
    <div className="space-y-8">
      {!results && (
        <div className="rounded-2xl border border-border bg-charcoal p-6 sm:p-8">
          <h2 className="mb-2 text-xl font-bold">{t("uploadTitle")}</h2>
          <p className="mb-6 text-steel-light">{t("uploadDesc")}</p>

          {mode === "upload" ? (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-12 transition-colors hover:border-accent-red hover:bg-accent-red-glow"
            >
              <Upload className="mb-4 h-12 w-12 text-accent-red" />
              <p className="mb-2 text-lg font-medium">{t("dropzone")}</p>
              <p className="text-sm text-steel-light">{t("supportedFormats")}</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={() => handleAnalyze()}
              />
            </button>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("textPlaceholder")}
              rows={6}
              className="w-full rounded-xl border border-border bg-background p-4 text-foreground placeholder:text-steel focus:border-accent-red focus:outline-none"
            />
          )}

          <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => setMode(mode === "upload" ? "text" : "upload")}
              className="flex items-center gap-2 text-sm text-accent-red hover:underline"
            >
              <FileText className="h-4 w-4" />
              {mode === "upload" ? tCommon("pasteText") : tCommon("upload")}
            </button>
            <BigButton onClick={handleAnalyze} disabled={analyzing} size="md">
              {analyzing ? t("analyzing") : t("analyze")}
            </BigButton>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t("resultsTitle")}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <ResultCard
              icon={<CheckCircle className="h-5 w-5 text-success" />}
              title={t("necessary")}
              items={results.necessary}
              variant="success"
            />
            <ResultCard
              icon={<AlertTriangle className="h-5 w-5 text-warning" />}
              title={t("upsell")}
              items={results.upsell}
              variant="warning"
            />
          </div>

          <div className="rounded-2xl border border-border bg-charcoal p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-accent-red" />
              <h3 className="font-semibold">{t("fairPrice")}</h3>
            </div>
            <p className="text-2xl font-bold text-accent-red">
              ${results.fairPriceMin.toLocaleString()} – ${results.fairPriceMax.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-steel-light">
              Quoted: ${results.totalQuoted.toLocaleString()}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-charcoal p-6">
            <h3 className="mb-2 font-semibold">{t("urgency")}</h3>
            <p>{urgencyLabels[results.urgency]}</p>
          </div>

          <div className={clsx(
            "rounded-2xl border-2 p-6 text-center",
            results.verdict === "fair" && "border-success bg-success/10",
            results.verdict === "high" && "border-danger bg-danger/10",
            results.verdict === "low" && "border-warning bg-warning/10"
          )}>
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-steel-light">
              {t("verdict")}
            </h3>
            <p className="text-xl font-bold">{verdictLabels[results.verdict]}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton variant="secondary" onClick={() => setResults(null)}>
              {tCommon("back")}
            </BigButton>
            <BigButton>{t("saveReport")}</BigButton>
            <Link href="/chat" className="flex-1">
              <BigButton variant="outline" className="w-full">
                {t("askFollowUp")}
              </BigButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  icon,
  title,
  items,
  variant,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
  variant: "success" | "warning";
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-6",
        variant === "success" ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

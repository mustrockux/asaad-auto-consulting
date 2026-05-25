"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { BigButton } from "./BigButton";
import { UpsellBanner } from "./UpsellBanner";
import type { AIQuoteAnalysis, UrgencyLevel } from "@/lib/services";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";

const URGENCY_EMOJI: Record<UrgencyLevel, string> = {
  now: "🔴",
  soon: "🟡",
  later: "🟢",
};

export function QuoteUpload() {
  const t = useTranslations("quote");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [mode, setMode] = useState<"upload" | "text">("upload");
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AIQuoteAnalysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    const quoteText =
      text ||
      "Brake pad replacement $320, Oil change $65, Coolant flush $149, Fuel injection cleaning $189. Total: $723";
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: quoteText, locale }),
      });
      const data = await res.json();
      setResults(data.analysis);
    } catch {
      setResults(null);
    } finally {
      setAnalyzing(false);
    }
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
          <div className="mb-4 flex w-fit items-center gap-2 rounded-lg bg-accent-red-glow px-3 py-2">
            <Sparkles className="h-4 w-4 text-accent-red" />
            <span className="text-sm font-medium text-accent-red">{t("aiPowered")}</span>
            <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-bold text-success">
              {tCommon("free")}
            </span>
          </div>
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
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-red" />
            <h2 className="text-2xl font-bold">{t("aiResultsTitle")}</h2>
          </div>

          <div className="rounded-2xl border border-accent-red/30 bg-accent-red-glow p-5">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent-red">
              {t("aiSummary")}
            </p>
            <p className="text-lg">{results.aiSummary}</p>
            {results.savingsPotential > 0 && (
              <p className="mt-2 text-sm text-steel-light">
                {t("potentialSavings")}:{" "}
                <span className="font-bold text-success">
                  ${results.savingsPotential.toLocaleString()}
                </span>
              </p>
            )}
          </div>

          <div
            className={clsx(
              "flex items-center gap-4 rounded-2xl border-2 p-5",
              results.urgency === "now" && "border-danger bg-danger/10",
              results.urgency === "soon" && "border-warning bg-warning/10",
              results.urgency === "later" && "border-success bg-success/10"
            )}
          >
            <span className="text-3xl">{URGENCY_EMOJI[results.urgency]}</span>
            <div>
              <p className="font-semibold">{t("urgency")}</p>
              <p className="text-steel-light">{urgencyLabels[results.urgency]}</p>
            </div>
          </div>

          {results.lineItems.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">{t("lineItems")}</h3>
              {results.lineItems.map((item) => (
                <LineItemRow key={item.name} item={item} fairRangeLabel={t("fairRange")} />
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
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
            <ResultCard
              icon={<XCircle className="h-5 w-5 text-danger" />}
              title={t("suspicious")}
              items={results.suspicious}
              variant="danger"
            />
          </div>

          <div className="rounded-2xl border border-border bg-charcoal p-6">
            <div className="mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent-red" />
              <h3 className="font-semibold">{t("fairPrice")}</h3>
            </div>
            <p className="text-2xl font-bold text-accent-red">
              ${results.fairPriceMin.toLocaleString()} – ${results.fairPriceMax.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-steel-light">
              {t("quoted")}: ${results.totalQuoted.toLocaleString()}
            </p>
          </div>

          <div
            className={clsx(
              "rounded-2xl border-2 p-6 text-center",
              results.verdict === "fair" && "border-success bg-success/10",
              results.verdict === "high" && "border-danger bg-danger/10",
              results.verdict === "low" && "border-warning bg-warning/10"
            )}
          >
            <h3 className="mb-2 text-sm font-medium uppercase tracking-wide text-steel-light">
              {t("verdict")}
            </h3>
            <p className="text-xl font-bold">{verdictLabels[results.verdict]}</p>
          </div>

          <UpsellBanner variant="quote" />

          <div className="flex flex-col gap-3 sm:flex-row">
            <BigButton variant="secondary" onClick={() => setResults(null)}>
              {tCommon("back")}
            </BigButton>
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

function LineItemRow({
  item,
  fairRangeLabel,
}: {
  item: AIQuoteAnalysis["lineItems"][0];
  fairRangeLabel: string;
}) {
  const categoryColors = {
    necessary: "text-success",
    upsell: "text-warning",
    suspicious: "text-danger",
  };
  return (
    <div className="rounded-xl border border-border bg-charcoal p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="mt-1 text-xs text-steel-light">{item.reason}</p>
        </div>
        <p className="text-[85%] text-end">
          <span className="font-bold">${item.quotedPrice.toLocaleString()}</span>
          <span className="block text-xs text-steel-light">
            {fairRangeLabel}: ${item.fairPriceMin}–${item.fairPriceMax}
          </span>
        </p>
      </div>
      <div className="mt-2 flex gap-2 text-xs capitalize">
        <span className={categoryColors[item.category]}>{item.category}</span>
        <span>{URGENCY_EMOJI[item.urgency]}</span>
      </div>
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
  variant: "success" | "warning" | "danger";
}) {
  const styles = {
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    danger: "border-danger/30 bg-danger/5",
  };
  return (
    <div className={clsx("rounded-2xl border p-6", styles[variant])}>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="text-sm text-steel-light">—</li>
        ) : (
          items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

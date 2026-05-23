"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BigButton } from "./BigButton";
import { calculateMonthlyPayment, evaluateDeal } from "@/lib/services";
import { AlertTriangle, Calculator } from "lucide-react";
import clsx from "clsx";

export function CarBuyingAssistant() {
  const t = useTranslations("carBuying");
  const [askingPrice, setAskingPrice] = useState("22000");
  const [marketValue, setMarketValue] = useState("20500");
  const [apr, setApr] = useState("6.9");
  const [term, setTerm] = useState("60");
  const [dealResult, setDealResult] = useState<"good" | "bad" | "unclear" | null>(null);
  const [payment, setPayment] = useState<{ monthly: number; total: number } | null>(null);

  const redFlags = ["redFlag1", "redFlag2", "redFlag3", "redFlag4", "redFlag5"] as const;

  const checkDeal = () => {
    const result = evaluateDeal(Number(askingPrice), Number(marketValue));
    setDealResult(result);
  };

  const calcPayment = () => {
    setPayment(calculateMonthlyPayment(Number(askingPrice), Number(apr), Number(term)));
  };

  const dealLabels = {
    good: t("dealGood"),
    bad: t("dealBad"),
    unclear: t("dealUnclear"),
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-border bg-charcoal p-6 sm:p-8">
        <h2 className="mb-6 text-xl font-bold">{t("dealChecker")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("vehiclePrice")} value={askingPrice} onChange={setAskingPrice} prefix="$" />
          <Field label={t("marketValue")} value={marketValue} onChange={setMarketValue} prefix="$" />
        </div>
        <div className="mt-6">
          <BigButton onClick={checkDeal}>{t("checkDeal")}</BigButton>
        </div>
        {dealResult && (
          <p
            className={clsx(
              "mt-4 rounded-xl p-4 font-medium",
              dealResult === "good" && "bg-success/10 text-success",
              dealResult === "bad" && "bg-danger/10 text-danger",
              dealResult === "unclear" && "bg-warning/10 text-warning"
            )}
          >
            {dealLabels[dealResult]}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-border bg-charcoal p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-xl font-bold">{t("redFlags")}</h2>
        </div>
        <ul className="space-y-3">
          {redFlags.map((key) => (
            <li key={key} className="flex items-start gap-3 text-steel-light">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent-red" />
              {t(key)}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-border bg-charcoal p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-accent-red" />
          <h2 className="text-xl font-bold">{t("financingTitle")}</h2>
        </div>
        <p className="mb-6 text-steel-light">{t("financingDesc")}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("vehiclePrice")} value={askingPrice} onChange={setAskingPrice} prefix="$" />
          <Field label={t("aprLabel")} value={apr} onChange={setApr} suffix="%" />
          <Field label={t("termLabel")} value={term} onChange={setTerm} />
        </div>
        <div className="mt-6">
          <BigButton variant="secondary" onClick={calcPayment}>
            {t("calculate")}
          </BigButton>
        </div>
        {payment && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Stat label={t("monthlyPayment")} value={`$${payment.monthly.toFixed(0)}`} />
            <Stat label={t("totalCost")} value={`$${payment.total.toFixed(0)}`} />
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-steel-light">{label}</span>
      <div className="relative">
        {prefix && (
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-steel">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            "w-full rounded-xl border border-border bg-background py-3 focus:border-accent-red focus:outline-none",
            prefix ? "ps-8 pe-4" : "px-4"
          )}
        />
        {suffix && (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-steel">{suffix}</span>
        )}
      </div>
    </label>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-sm text-steel-light">{label}</p>
      <p className="text-2xl font-bold text-accent-red">{value}</p>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { PRICING_TIERS } from "@/lib/pricing";
import { Check, Sparkles, Bot, User } from "lucide-react";
import clsx from "clsx";

export function PricingTiers() {
  const t = useTranslations("payments");

  const tiers = [
    {
      id: "ai" as const,
      icon: Bot,
      title: t("tierAi"),
      price: PRICING_TIERS.ai.priceLabel,
      desc: t("tierAiDesc"),
      features: [t("aiQuoteAnalysis"), t("aiChat"), t("aiDealCheck")],
      cta: t("startFree"),
      variant: "secondary" as const,
      badge: t("freeForever"),
    },
    {
      id: "aiPlus" as const,
      icon: Sparkles,
      title: t("tierAiPlus"),
      price: PRICING_TIERS.aiPlus.priceLabel,
      desc: t("tierAiPlusDesc"),
      features: [t("unlimitedAiQuotes"), t("unlimitedAiChat"), t("savedReports")],
      cta: t("upgradeAiPlus"),
      variant: "secondary" as const,
    },
    {
      id: "human" as const,
      icon: User,
      title: t("tierHuman"),
      price: PRICING_TIERS.human.priceLabel,
      desc: t("tierHumanDesc"),
      features: [
        t("asaadQuoteReview"),
        t("asaadChatSession"),
        t("asaadVideoCall"),
        t("prioritySupport"),
      ],
      cta: t("subscribe"),
      variant: "primary" as const,
      badge: t("popular"),
      highlight: true,
    },
  ];

  const humanAddOns = [
    { name: t("asaadQuoteReview"), price: "$9.99" },
    { name: t("asaadChatSession"), price: "$14.99" },
    { name: t("asaadVideoCall"), price: "$24.99" },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <p className="mb-4 text-center text-lg font-medium text-accent-red">{t("upsellHeadline")}</p>
      <p className="mb-10 text-center text-sm text-steel-light">{t("currencyNote")}</p>

      <div className="mb-12 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div
              key={tier.id}
              className={clsx(
                "relative rounded-2xl border p-6 sm:p-8",
                tier.highlight
                  ? "border-2 border-accent-red bg-charcoal glow-red"
                  : "border-border bg-charcoal"
              )}
            >
              {tier.badge && (
                <span
                  className={clsx(
                    "absolute -top-3 start-6 rounded-full px-3 py-1 text-xs font-bold",
                    tier.highlight ? "bg-accent-red text-white" : "bg-success/20 text-success"
                  )}
                >
                  {tier.badge}
                </span>
              )}
              <Icon className="mb-4 h-8 w-8 text-accent-red" />
              <h2 className="mb-1 text-xl font-bold">{tier.title}</h2>
              <p className="mb-4 text-3xl font-bold text-accent-red">{tier.price}</p>
              <p className="mb-6 text-sm text-steel-light">{tier.desc}</p>
              <ul className="mb-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <BigButton variant={tier.variant} className="w-full">
                {tier.cta}
              </BigButton>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-border bg-charcoal p-6 sm:p-8">
        <h2 className="mb-2 text-xl font-bold">{t("humanAddOns")}</h2>
        <p className="mb-6 text-steel-light">{t("humanAddOnsDesc")}</p>
        <ul className="space-y-4">
          {humanAddOns.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between border-b border-border pb-4 last:border-0"
            >
              <span>{item.name}</span>
              <span className="text-lg font-bold text-accent-red">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { CheckoutButton } from "./CheckoutButton";
import { Sparkles, User, AlertTriangle } from "lucide-react";
import { PAY_PER_USE, formatPrice } from "@/lib/pricing";
import type { PayPerUseProduct } from "@/lib/pricing";
import clsx from "clsx";

type UpsellVariant = "quote" | "chat" | "highRisk";

const VARIANT_PRODUCT: Record<UpsellVariant, PayPerUseProduct> = {
  quote: "quoteReview",
  chat: "liveCall",
  highRisk: "videoConsult",
};

interface UpsellBannerProps {
  variant: UpsellVariant;
  className?: string;
}

export function UpsellBanner({ variant, className }: UpsellBannerProps) {
  const t = useTranslations("upsell");
  const product = VARIANT_PRODUCT[variant];
  const price = formatPrice(PAY_PER_USE[product].price);

  const config = {
    quote: {
      icon: User,
      title: t("quoteTitle"),
      desc: t("quoteDesc"),
      cta: t("quoteCta"),
      accent: "border-accent-red bg-accent-red-glow",
      buttonVariant: "outline" as const,
    },
    chat: {
      icon: User,
      title: t("chatTitle"),
      desc: t("chatDesc"),
      cta: t("chatCta"),
      accent: "border-border bg-charcoal",
      buttonVariant: "outline" as const,
    },
    highRisk: {
      icon: AlertTriangle,
      title: t("highRiskTitle"),
      desc: t("highRiskDesc"),
      cta: t("highRiskCta"),
      accent: "border-warning bg-warning/10",
      buttonVariant: "primary" as const,
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div className={clsx("rounded-2xl border-2 p-6", config.accent, className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-red/20">
            <Icon className="h-6 w-6 text-accent-red" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-steel-light" />
              <span className="text-xs font-medium uppercase tracking-wide text-steel-light">
                {t("payPerUse")}
              </span>
            </div>
            <h3 className="font-bold">{config.title}</h3>
            <p className="mt-1 text-sm text-steel-light">{config.desc}</p>
            <p className="mt-2 text-sm font-semibold text-accent-red">
              {t("oneTimePrice", { price })}
            </p>
          </div>
        </div>
        <CheckoutButton product={product} variant={config.buttonVariant} className="shrink-0 sm:min-w-[180px]">
          {config.cta}
        </CheckoutButton>
      </div>
    </div>
  );
}

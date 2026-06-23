"use client";

import { useTranslations } from "next-intl";
import { PAY_PER_USE, formatPrice } from "@/lib/pricing";
import { CheckoutButton } from "./CheckoutButton";
import { Sparkles, User, AlertTriangle, Lock } from "lucide-react";
import clsx from "clsx";

export type PaywallVariant = "quote" | "chat" | "highRisk" | "carBuying";

interface PaywallBannerProps {
  variant: PaywallVariant;
  className?: string;
  showHumanUpsell?: boolean;
}

export function PaywallBanner({
  variant,
  className,
  showHumanUpsell = variant === "quote",
}: PaywallBannerProps) {
  const t = useTranslations("paywall");
  const price = formatPrice(PAY_PER_USE.aiPlus.price);

  const config = {
    quote: {
      icon: Lock,
      title: t("quoteTitle"),
      desc: t("quoteDesc"),
      accent: "border-accent-red bg-accent-red-glow",
    },
    chat: {
      icon: Sparkles,
      title: t("chatTitle"),
      desc: t("chatDesc"),
      accent: "border-border bg-charcoal",
    },
    highRisk: {
      icon: AlertTriangle,
      title: t("highRiskTitle"),
      desc: t("highRiskDesc"),
      accent: "border-warning bg-warning/10",
    },
    carBuying: {
      icon: Lock,
      title: t("carBuyingTitle"),
      desc: t("carBuyingDesc"),
      accent: "border-accent-red bg-accent-red-glow",
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div className={clsx("rounded-2xl border-2 p-5 sm:p-6", config.accent, className)}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-red/20">
            <Icon className="h-5 w-5 text-accent-red" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-steel-light">
              {t("aiPlusLabel")}
            </p>
            <h3 className="font-bold">{config.title}</h3>
            <p className="mt-1 text-sm text-steel-light">{config.desc}</p>
            <p className="mt-2 text-sm font-semibold text-accent-red">
              {t("oneTimePrice", { price })}
            </p>
          </div>
        </div>

        <CheckoutButton product="aiPlus" variant="primary">
          {t("unlockAiPlus")}
        </CheckoutButton>

        {showHumanUpsell && (
          <div className="rounded-xl border border-border bg-background/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-steel-light" />
                <div>
                  <p className="text-sm font-semibold">{t("humanReviewTitle")}</p>
                  <p className="text-xs text-steel-light">{t("humanReviewDesc")}</p>
                </div>
              </div>
              <CheckoutButton product="quoteReview" variant="outline" className="sm:min-w-[160px]">
                {t("humanReviewCta")}
              </CheckoutButton>
            </div>
          </div>
        )}

        {variant === "highRisk" && (
          <CheckoutButton product="videoConsult" variant="secondary">
            {t("bookVideoInstead")}
          </CheckoutButton>
        )}
      </div>
    </div>
  );
}

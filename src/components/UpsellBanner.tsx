"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BigButton } from "./BigButton";
import { Sparkles, User, AlertTriangle } from "lucide-react";
import clsx from "clsx";

type UpsellVariant = "quote" | "chat" | "highRisk";

interface UpsellBannerProps {
  variant: UpsellVariant;
  price?: string;
  className?: string;
}

export function UpsellBanner({ variant, price = "$9.99", className }: UpsellBannerProps) {
  const t = useTranslations("upsell");

  const config = {
    quote: {
      icon: User,
      title: t("quoteTitle"),
      desc: t("quoteDesc"),
      cta: t("quoteCta"),
      href: "/payments" as const,
      accent: "border-accent-red bg-accent-red-glow",
    },
    chat: {
      icon: User,
      title: t("chatTitle"),
      desc: t("chatDesc"),
      cta: t("chatCta"),
      href: "/ask" as const,
      accent: "border-border bg-charcoal",
    },
    highRisk: {
      icon: AlertTriangle,
      title: t("highRiskTitle"),
      desc: t("highRiskDesc"),
      cta: t("highRiskCta"),
      href: "/ask" as const,
      accent: "border-warning bg-warning/10",
    },
  }[variant];

  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "rounded-2xl border-2 p-6",
        config.accent,
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-red/20">
            <Icon className="h-6 w-6 text-accent-red" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-steel-light" />
              <span className="text-xs font-medium uppercase tracking-wide text-steel-light">
                {t("aiFirst")}
              </span>
            </div>
            <h3 className="font-bold">{config.title}</h3>
            <p className="mt-1 text-sm text-steel-light">{config.desc}</p>
            {variant === "quote" && (
              <p className="mt-2 text-sm font-semibold text-accent-red">
                {t("fromPrice", { price })}
              </p>
            )}
          </div>
        </div>
        <Link href={config.href} className="shrink-0">
          <BigButton size="md" variant={variant === "highRisk" ? "primary" : "outline"}>
            {config.cta}
          </BigButton>
        </Link>
      </div>
    </div>
  );
}

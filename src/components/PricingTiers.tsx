"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { PAY_PER_USE, formatPrice } from "@/lib/pricing";
import { Check, FileSearch, Phone, Video, Sparkles } from "lucide-react";
import clsx from "clsx";

export function PricingTiers() {
  const t = useTranslations("payments");
  const tCommon = useTranslations("common");

  const plans = [
    {
      id: "quoteReview" as const,
      icon: FileSearch,
      price: PAY_PER_USE.quoteReview.price,
      highlight: true,
      featureKeys: [
        "quoteFeature1",
        "quoteFeature2",
        "quoteFeature3",
        "quoteFeature4",
        "quoteFeature5",
        "quoteFeature6",
      ],
    },
    {
      id: "liveCall" as const,
      icon: Phone,
      price: PAY_PER_USE.liveCall.price,
      featureKeys: ["callFeature1", "callFeature2", "callFeature3", "callFeature4"],
    },
    {
      id: "videoConsult" as const,
      icon: Video,
      price: PAY_PER_USE.videoConsult.price,
      featureKeys: ["videoFeature1", "videoFeature2", "videoFeature3", "videoFeature4"],
    },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-10 rounded-2xl border border-border bg-charcoal p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-accent-red" />
          <div>
            <p className="font-semibold">{t("freeAiNote")}</p>
            <p className="mt-1 text-sm text-steel-light">{t("freeAiNoteDesc")}</p>
            <Link href="/quote" className="mt-3 inline-block text-sm font-medium text-accent-red hover:underline">
              {t("tryFreeAi")} →
            </Link>
          </div>
        </div>
      </div>

      <p className="mb-8 text-center text-sm text-steel-light">{t("currencyNote")}</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map(({ id, icon: Icon, price, highlight, featureKeys }) => (
          <div
            key={id}
            className={clsx(
              "relative flex flex-col rounded-2xl border p-6 sm:p-8",
              highlight
                ? "border-2 border-accent-red bg-charcoal glow-red"
                : "border-border bg-charcoal"
            )}
          >
            {highlight && (
              <span className="absolute -top-3 start-6 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white">
                {t("mostPopular")}
              </span>
            )}
            <Icon className="mb-4 h-8 w-8 text-accent-red" />
            <h2 className="text-xl font-bold">{t(`${id}Title`)}</h2>
            <p className="mt-2 text-sm text-steel-light">{t(`${id}Desc`)}</p>
            <p className="my-4">
              <span className="text-4xl font-bold text-accent-red">{formatPrice(price)}</span>
              <span className="text-steel-light"> {tCommon("perUse")}</span>
            </p>
            <ul className="mb-8 flex-1 space-y-3">
              {featureKeys.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {t(key)}
                </li>
              ))}
            </ul>
            <BigButton variant={highlight ? "primary" : "secondary"} className="w-full">
              {t("buyNow")}
            </BigButton>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

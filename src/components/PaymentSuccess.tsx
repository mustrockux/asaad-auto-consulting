"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageContainer } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { MaskedPhoneLink } from "@/components/MaskedPhoneLink";
import { PAY_PER_USE } from "@/lib/pricing";
import { CheckCircle, Phone, Video, FileSearch } from "lucide-react";

const PRODUCT_ICONS = {
  quoteReview: FileSearch,
  liveCall: Phone,
  videoConsult: Video,
};

export function PaymentSuccess({
  product,
}: {
  product: "quoteReview" | "liveCall" | "videoConsult" | null;
}) {
  const t = useTranslations("payments");

  const validProduct =
    product && product in PAY_PER_USE ? product : null;

  const Icon = validProduct ? PRODUCT_ICONS[validProduct] : CheckCircle;

  return (
    <PageContainer>
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-success/20 p-4">
            <Icon className="h-12 w-12 text-success" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">{t("successTitle")}</h1>
        <p className="mb-8 text-steel-light">
          {validProduct ? t(`successDesc_${validProduct}`) : t("successDescGeneric")}
        </p>

        {(validProduct === "liveCall" || validProduct === "videoConsult") && (
          <div className="mb-8 rounded-2xl border border-border bg-charcoal p-6">
            <p className="mb-3 text-sm text-steel-light">{t("successPhonePrompt")}</p>
            <MaskedPhoneLink
              className="text-xl"
              label={t("successPhoneLabel")}
            />
            {validProduct === "videoConsult" && (
              <p className="mt-4 text-sm text-steel-light">{t("successVideoNote")}</p>
            )}
          </div>
        )}

        {validProduct === "quoteReview" && (
          <div className="mb-8 rounded-2xl border border-border bg-charcoal p-6 text-start">
            <p className="text-sm text-steel-light">{t("successQuoteNote")}</p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <BigButton variant="secondary">{t("successDashboard")}</BigButton>
          </Link>
          <Link href="/">
            <BigButton>{t("successHome")}</BigButton>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}

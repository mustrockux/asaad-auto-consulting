"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PageContainer } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { MaskedPhoneLink } from "@/components/MaskedPhoneLink";
import { PAY_PER_USE, type PayPerUseProduct } from "@/lib/pricing";
import { grantProduct } from "@/lib/entitlements";
import { CheckCircle, Phone, Video, FileSearch, Sparkles } from "lucide-react";

const PRODUCT_ICONS = {
  aiPlus: Sparkles,
  quoteReview: FileSearch,
  liveCall: Phone,
  videoConsult: Video,
};

export function PaymentSuccess({
  product: initialProduct,
  sessionId,
}: {
  product: PayPerUseProduct | null;
  sessionId: string | null;
}) {
  const t = useTranslations("payments");
  const [product, setProduct] = useState<PayPerUseProduct | null>(initialProduct);
  const [verifying, setVerifying] = useState(!!sessionId);

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((r) => r.json())
        .then((data: { paid?: boolean; product?: PayPerUseProduct | null }) => {
          if (data.paid && data.product) {
            grantProduct(data.product);
            setProduct(data.product);
          }
        })
        .finally(() => setVerifying(false));
      return;
    }

    if (initialProduct) {
      grantProduct(initialProduct);
      setVerifying(false);
    } else {
      setVerifying(false);
    }
  }, [sessionId, initialProduct]);

  const validProduct = product && product in PAY_PER_USE ? product : null;
  const Icon = validProduct ? PRODUCT_ICONS[validProduct] : CheckCircle;

  return (
    <PageContainer>
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-success/20 p-4">
            <Icon className="h-12 w-12 text-success" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold">
          {verifying ? t("successVerifying") : t("successTitle")}
        </h1>
        <p className="mb-8 text-steel-light">
          {validProduct ? t(`successDesc_${validProduct}`) : t("successDescGeneric")}
        </p>

        {validProduct === "aiPlus" && (
          <div className="mb-8 rounded-2xl border border-accent-red/30 bg-accent-red-glow p-6 text-start">
            <p className="text-sm text-steel-light">{t("successAiPlusNote")}</p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Link href="/quote">
                <BigButton variant="secondary" className="w-full">
                  {t("successAiPlusQuote")}
                </BigButton>
              </Link>
              <Link href="/chat">
                <BigButton className="w-full">{t("successAiPlusChat")}</BigButton>
              </Link>
            </div>
          </div>
        )}

        {(validProduct === "liveCall" || validProduct === "videoConsult") && (
          <div className="mb-8 rounded-2xl border border-border bg-charcoal p-6">
            <p className="mb-3 text-sm text-steel-light">{t("successPhonePrompt")}</p>
            <MaskedPhoneLink className="text-xl" label={t("successPhoneLabel")} />
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

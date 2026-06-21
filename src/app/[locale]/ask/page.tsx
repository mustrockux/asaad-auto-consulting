import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { CheckoutButton } from "@/components/CheckoutButton";
import { MaskedPhoneLink } from "@/components/MaskedPhoneLink";
import { BigButton } from "@/components/BigButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { MessageCircle, Phone, Video, Clock } from "lucide-react";
import { PAY_PER_USE, formatPrice } from "@/lib/pricing";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function AskPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ask");
  const tCommon = await getTranslations("common");
  const tPay = await getTranslations("payments");

  const options = [
    {
      icon: MessageCircle,
      title: t("chatTitle"),
      desc: t("chatDesc"),
      cta: t("startChat"),
      href: "/chat",
      price: null,
      free: true,
      product: null as null,
    },
    {
      icon: Phone,
      title: t("callTitle"),
      desc: t("callDesc"),
      cta: t("requestCall"),
      price: formatPrice(PAY_PER_USE.liveCall.price),
      free: false,
      product: "liveCall" as const,
    },
    {
      icon: Video,
      title: t("videoTitle"),
      desc: t("videoDesc"),
      cta: t("startVideo"),
      price: formatPrice(PAY_PER_USE.videoConsult.price),
      free: false,
      product: "videoConsult" as const,
    },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-8 rounded-2xl border border-border bg-charcoal p-6">
        <p className="mb-4 text-sm text-steel-light">{t("selectLanguage")}</p>
        <LanguageSelector />
      </div>

      <div className="mb-8 rounded-2xl border border-accent-red/30 bg-accent-red-glow p-6 text-center">
        <p className="mb-2 text-sm text-steel-light">{tPay("consultLineTitle")}</p>
        <MaskedPhoneLink className="text-xl" />
        <p className="mt-2 text-xs text-steel-light">{tPay("consultLineNote")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {options.map(({ icon: Icon, title, desc, cta, href, price, free, product }) => (
          <div
            key={title}
            className="flex flex-col rounded-2xl border border-border bg-charcoal p-6"
          >
            <Icon className="mb-4 h-10 w-10 text-accent-red" />
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="mb-4 flex-1 text-steel-light">{desc}</p>
            {free ? (
              <p className="mb-4 text-lg font-bold text-success">{tCommon("free")}</p>
            ) : (
              <p className="mb-4">
                <span className="text-2xl font-bold text-accent-red">{price}</span>
                <span className="text-steel-light"> {tCommon("perUse")}</span>
              </p>
            )}
            <div className="mb-4 flex items-center gap-4 text-sm text-steel-light">
              <span className="flex items-center gap-1 text-success">
                <span className="h-2 w-2 rounded-full bg-success" />
                {t("available")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {t("waitTime")}
              </span>
            </div>
            {free ? (
              <Link href={href!}>
                <BigButton variant="primary" className="w-full">
                  {cta}
                </BigButton>
              </Link>
            ) : product ? (
              <CheckoutButton product={product} variant="secondary" className="w-full">
                {cta}
              </CheckoutButton>
            ) : null}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { routing } from "@/i18n/routing";
import { Check } from "lucide-react";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("payments");

  const payPerUse = [
    { name: t("quoteReview"), price: "$9.99" },
    { name: t("chatSession"), price: "$4.99" },
    { name: t("videoCall"), price: "$19.99" },
  ];

  const subscriptionFeatures = [
    t("unlimitedQuotes"),
    t("unlimitedChat"),
    t("prioritySupport"),
    t("familyPlan"),
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <p className="mb-8 text-center text-sm text-steel-light">{t("currencyNote")}</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-charcoal p-8">
          <h2 className="mb-2 text-2xl font-bold">{t("payPerUse")}</h2>
          <p className="mb-6 text-steel-light">{t("payPerUseDesc")}</p>
          <ul className="mb-8 space-y-4">
            {payPerUse.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0"
              >
                <span>{item.name}</span>
                <span className="text-xl font-bold text-accent-red">{item.price}</span>
              </li>
            ))}
          </ul>
          <BigButton variant="secondary" className="w-full">
            {t("buyNow")}
          </BigButton>
        </div>

        <div className="relative rounded-2xl border-2 border-accent-red bg-charcoal p-8 glow-red">
          <span className="absolute -top-3 start-6 rounded-full bg-accent-red px-3 py-1 text-xs font-bold text-white">
            {t("popular")}
          </span>
          <h2 className="mb-2 text-2xl font-bold">{t("subscription")}</h2>
          <p className="mb-4 text-steel-light">{t("subscriptionDesc")}</p>
          <p className="mb-6">
            <span className="text-4xl font-bold text-accent-red">$29.99</span>
            <span className="text-steel-light"> / month</span>
          </p>
          <ul className="mb-8 space-y-3">
            {subscriptionFeatures.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-5 w-5 shrink-0 text-success" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <BigButton className="w-full">{t("subscribe")}</BigButton>
        </div>
      </div>
    </PageContainer>
  );
}

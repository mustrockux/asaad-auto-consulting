import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { QuoteUpload } from "@/components/QuoteUpload";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quote");

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <QuoteUpload />
    </PageContainer>
  );
}

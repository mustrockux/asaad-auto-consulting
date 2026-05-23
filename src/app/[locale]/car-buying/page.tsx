import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { CarBuyingAssistant } from "@/components/CarBuyingAssistant";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function CarBuyingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("carBuying");

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <CarBuyingAssistant />
    </PageContainer>
  );
}

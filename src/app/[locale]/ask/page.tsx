import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { BigButton } from "@/components/BigButton";
import { LanguageSelector } from "@/components/LanguageSelector";
import { MessageCircle, Phone, Video, Clock } from "lucide-react";
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

  const options = [
    {
      icon: MessageCircle,
      title: t("chatTitle"),
      desc: t("chatDesc"),
      cta: t("startChat"),
      href: "/chat",
      primary: true,
    },
    {
      icon: Phone,
      title: t("callTitle"),
      desc: t("callDesc"),
      cta: t("requestCall"),
      href: "/chat",
      primary: false,
    },
    {
      icon: Video,
      title: t("videoTitle"),
      desc: t("videoDesc"),
      cta: t("startVideo"),
      href: "/chat",
      primary: false,
    },
  ];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="mb-8 rounded-2xl border border-border bg-charcoal p-6">
        <p className="mb-4 text-sm text-steel-light">{t("selectLanguage")}</p>
        <LanguageSelector />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3">
        {options.map(({ icon: Icon, title, desc, cta, href, primary }) => (
          <div
            key={title}
            className="flex flex-col rounded-2xl border border-border bg-charcoal p-6"
          >
            <Icon className="mb-4 h-10 w-10 text-accent-red" />
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="mb-4 flex-1 text-steel-light">{desc}</p>
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
            <Link href={href}>
              <BigButton variant={primary ? "primary" : "secondary"} className="w-full">
                {cta}
              </BigButton>
            </Link>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}

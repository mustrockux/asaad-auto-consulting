import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BigButton } from "@/components/BigButton";
import { PageContainer } from "@/components/PageLayout";
import {
  Shield,
  FileSearch,
  MessageCircle,
  Car,
  BookOpen,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("landing");

  const features = [
    { icon: FileSearch, title: t("feature1Title"), desc: t("feature1Desc"), href: "/quote" as const },
    { icon: MessageCircle, title: t("feature2Title"), desc: t("feature2Desc"), href: "/ask" as const },
    { icon: Car, title: t("feature3Title"), desc: t("feature3Desc"), href: "/car-buying" as const },
    { icon: BookOpen, title: t("feature4Title"), desc: t("feature4Desc"), href: "/library" as const },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-red-glow to-transparent opacity-50" />
        <PageContainer>
          <div className="relative py-16 sm:py-24 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-charcoal px-4 py-2 text-sm text-steel-light">
              <Shield className="h-4 w-4 text-accent-red" />
              {t("trustBadge")}
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-gradient">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-steel-light sm:text-xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/ask">
                <BigButton>{t("ctaAsk")}</BigButton>
              </Link>
              <Link href="/quote">
                <BigButton variant="outline">{t("ctaQuote")}</BigButton>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl">
          {t("featuresTitle")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc, href }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl border border-border bg-charcoal p-6 transition-all hover:border-accent-red hover:glow-red"
            >
              <Icon className="mb-4 h-8 w-8 text-accent-red transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">{title}</h3>
              <p className="text-steel-light">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="my-16 grid grid-cols-3 gap-4 text-center">
          <Stat icon={Users} value="3" label={t("statsUsers")} />
          <Stat icon={Clock} value="<5 min" label={t("statsResponse")} />
          <Stat icon={DollarSign} value="$400+" label={t("statsSaved")} />
        </div>
      </PageContainer>

      <section className="border-t border-border bg-charcoal py-16">
        <PageContainer>
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">{t("ctaSectionTitle")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-steel-light">{t("ctaSectionDesc")}</p>
            <Link href="/ask">
              <BigButton>{t("ctaAsk")}</BigButton>
            </Link>
          </div>
        </PageContainer>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <Icon className="mx-auto mb-2 h-6 w-6 text-accent-red" />
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-steel-light sm:text-sm">{label}</p>
    </div>
  );
}

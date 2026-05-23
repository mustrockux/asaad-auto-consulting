import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { articles, type ArticleCategory } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { AlertTriangle, Wrench, Building2 } from "lucide-react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const categoryIcons: Record<ArticleCategory, typeof AlertTriangle> = {
  scams: AlertTriangle,
  myths: Wrench,
  dealer: Building2,
};

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("library");

  const categories: ArticleCategory[] = ["scams", "myths", "dealer"];

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <div className="space-y-12">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const categoryArticles = articles.filter((a) => a.category === category);

          return (
            <section key={category}>
              <div className="mb-6 flex items-center gap-3">
                <Icon className="h-6 w-6 text-accent-red" />
                <h2 className="text-xl font-bold">{t(`categories.${category}`)}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryArticles.map((article) => (
                  <article
                    key={article.id}
                    className="rounded-2xl border border-border bg-charcoal p-5 transition-colors hover:border-accent-red"
                  >
                    <h3 className="mb-2 font-semibold">
                      {t(`articles.${article.id}.title`)}
                    </h3>
                    <p className="mb-4 text-sm text-steel-light">
                      {t(`articles.${article.id}.summary`)}
                    </p>
                    <span className="text-sm font-medium text-accent-red">
                      {t("readMore")} →
                    </span>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}

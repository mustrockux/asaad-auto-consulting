import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageContainer, PageHeader } from "@/components/PageLayout";
import { dashboardActivity } from "@/lib/data";
import { routing } from "@/i18n/routing";
import { FileSearch, MessageCircle } from "lucide-react";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  return (
    <PageContainer>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{t("recentActivity")}</h2>
        {dashboardActivity.length === 0 ? (
          <p className="rounded-2xl border border-border bg-charcoal p-8 text-center text-steel-light">
            {t("noActivity")}
          </p>
        ) : (
          <ul className="space-y-3">
            {dashboardActivity.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-2xl border border-border bg-charcoal p-4"
              >
                <div className="flex items-center gap-3">
                  {item.type === "quote" ? (
                    <FileSearch className="h-5 w-5 text-accent-red" />
                  ) : (
                    <MessageCircle className="h-5 w-5 text-accent-red" />
                  )}
                  <div>
                    <p className="font-medium">
                      {item.type === "quote" ? t("quoteReviewed") : t("chatSession")}
                    </p>
                    <p className="text-sm text-steel-light">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      item.status === "completed"
                        ? "text-success text-sm"
                        : "text-warning text-sm"
                    }
                  >
                    {item.status === "completed" ? t("completed") : t("pending")}
                  </span>
                  <Link
                    href={item.type === "quote" ? "/quote" : "/chat"}
                    className="text-sm text-accent-red hover:underline"
                  >
                    {item.type === "quote" ? t("viewReport") : t("continueChat")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">{t("savedReports")}</h2>
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-steel-light">
          {t("noActivity")}
        </p>
      </section>
    </PageContainer>
  );
}

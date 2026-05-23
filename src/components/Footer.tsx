import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

  return (
    <footer className="mt-auto border-t border-border bg-charcoal">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-steel-light">
          © {new Date().getFullYear()} {tCommon("brand")}. {t("rights")}
        </p>
        <div className="flex gap-6 text-sm text-steel-light">
          <a href="#" className="hover:text-foreground transition-colors">
            {t("privacy")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            {t("terms")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            {t("contact")}
          </a>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useLocale } from "next-intl";
import { localeFlags, localeNames, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import clsx from "clsx";

interface LanguageSelectorProps {
  compact?: boolean;
}

export function LanguageSelector({ compact = false }: LanguageSelectorProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className={clsx("flex gap-1", compact ? "flex-row" : "flex-col sm:flex-row")}>
      {(["en", "es", "ar"] as Locale[]).map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          className={clsx(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            locale === loc
              ? "bg-accent-red text-white"
              : "text-steel-light hover:bg-charcoal-light hover:text-foreground"
          )}
          aria-label={localeNames[loc]}
          aria-current={locale === loc ? "true" : undefined}
        >
          <span>{localeFlags[loc]}</span>
          {!compact && <span className="hidden sm:inline">{localeNames[loc]}</span>}
        </button>
      ))}
    </div>
  );
}

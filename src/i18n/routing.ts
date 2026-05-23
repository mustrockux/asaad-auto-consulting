import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "en",
  localePrefix: "always",
});

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  ar: "🇸🇦",
};

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

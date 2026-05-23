"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSelector } from "./LanguageSelector";
import { Menu, X, Shield } from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/quote", key: "quoteReview" },
  { href: "/ask", key: "askAsaad" },
  { href: "/car-buying", key: "carBuying" },
  { href: "/chat", key: "chat" },
  { href: "/library", key: "library" },
  { href: "/payments", key: "payments" },
  { href: "/dashboard", key: "dashboard" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-7 w-7 text-accent-red" />
          <div>
            <span className="text-lg font-bold">{tCommon("brand")}</span>
            <span className="hidden text-xs text-steel-light sm:block">
              {tCommon("tagline")}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-accent-red-glow text-accent-red"
                  : "text-steel-light hover:text-foreground"
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector compact />
          <button
            className="rounded-lg p-2 text-steel-light hover:bg-charcoal-light lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t("menu")}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border bg-charcoal px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "rounded-lg px-4 py-3 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-accent-red-glow text-accent-red"
                    : "text-steel-light hover:bg-charcoal-light hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

"use client";

import { MessageSquare, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { getMaskedPhone } from "@/lib/phone";
import clsx from "clsx";

interface MaskedPhoneLinkProps {
  label?: string;
  className?: string;
  showIcon?: boolean;
  layout?: "inline" | "buttons";
}

export function MaskedPhoneLink({
  label,
  className,
  showIcon = true,
  layout = "buttons",
}: MaskedPhoneLinkProps) {
  const t = useTranslations("payments");
  const phone = getMaskedPhone();

  if (!phone.isConfigured || !phone.tel) {
    return (
      <div className={clsx("text-center", className)}>
        {showIcon && <Phone className="mx-auto mb-2 h-6 w-6 text-steel-light" />}
        <p className="font-mono text-steel-light">{phone.display}</p>
        <p className="mt-2 text-xs text-steel">{t("phoneNotConfigured")}</p>
      </div>
    );
  }

  if (layout === "inline") {
    return (
      <a href={`tel:${phone.tel}`} className={className}>
        {showIcon && <Phone className="mb-1 inline h-4 w-4 text-accent-red" />}{" "}
        {label && <span className="text-steel-light">{label} </span>}
        <span className="font-semibold text-accent-red hover:underline">{phone.display}</span>
      </a>
    );
  }

  return (
    <div className={clsx("flex flex-col items-center gap-3", className)}>
      {label && <p className="text-sm text-steel-light">{label}</p>}
      <p className="font-mono text-2xl font-bold tracking-wide text-foreground">
        {phone.display}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${phone.tel}`}
          className="inline-flex items-center gap-2 rounded-xl bg-accent-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-red-dark"
        >
          <Phone className="h-4 w-4" />
          {t("consultCall")}
        </a>
        <a
          href={`sms:${phone.sms}`}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-charcoal px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent-red"
        >
          <MessageSquare className="h-4 w-4 text-accent-red" />
          {t("consultText")}
        </a>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { PayPerUseProduct } from "@/lib/pricing";
import { getCheckoutUrl } from "@/lib/checkout";
import { BigButton } from "./BigButton";
import clsx from "clsx";

interface CheckoutButtonProps {
  product: PayPerUseProduct;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({
  product,
  variant = "primary",
  className,
  children,
}: CheckoutButtonProps) {
  const t = useTranslations("payments");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const paymentLink = getCheckoutUrl(product);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, locale }),
      });

      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }

      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }

      alert(t("checkoutNotConfigured"));
    } catch {
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        alert(t("checkoutNotConfigured"));
      }
    } finally {
      setLoading(false);
    }
  };

  const configured = !!paymentLink;

  return (
    <BigButton
      variant={variant}
      className={clsx("w-full", className)}
      disabled={loading}
      onClick={handleCheckout}
    >
      {loading ? t("checkoutLoading") : children}
    </BigButton>
  );
}

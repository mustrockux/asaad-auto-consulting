"use client";

import type { PayPerUseProduct } from "@/lib/pricing";
import { getCheckoutUrl } from "@/lib/checkout";
import { BigButton } from "./BigButton";
import { useTranslations } from "next-intl";
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
  const checkoutUrl = getCheckoutUrl(product);

  if (checkoutUrl) {
    return (
      <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className={clsx("block", className)}>
        <BigButton variant={variant} className="w-full">
          {children}
        </BigButton>
      </a>
    );
  }

  return (
    <BigButton
      variant="secondary"
      className={clsx("w-full opacity-75", className)}
      disabled
      title={t("checkoutNotConfigured")}
    >
      {children}
    </BigButton>
  );
}

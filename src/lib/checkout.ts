import type { PayPerUseProduct } from "./pricing";

/**
 * Stripe Payment Links — fallback when STRIPE_SECRET_KEY is not set.
 * Create at: Stripe Dashboard → Product catalog → Payment links
 */
const CHECKOUT_ENV_KEYS: Record<PayPerUseProduct, string> = {
  aiPlus: "NEXT_PUBLIC_STRIPE_LINK_AI_PLUS",
  quoteReview: "NEXT_PUBLIC_STRIPE_LINK_QUOTE_REVIEW",
  liveCall: "NEXT_PUBLIC_STRIPE_LINK_LIVE_CALL",
  videoConsult: "NEXT_PUBLIC_STRIPE_LINK_VIDEO_CONSULT",
};

export function getCheckoutUrl(product: PayPerUseProduct): string | null {
  const key = CHECKOUT_ENV_KEYS[product];
  const url = process.env[key];
  return url && url.startsWith("https://") ? url : null;
}

export function isPaymentLinkConfigured(product?: PayPerUseProduct): boolean {
  if (product) return getCheckoutUrl(product) !== null;
  return (Object.keys(CHECKOUT_ENV_KEYS) as PayPerUseProduct[]).some(
    (p) => getCheckoutUrl(p) !== null
  );
}

/** True when Payment Links or Stripe Checkout API is available */
export function isCheckoutConfigured(product?: PayPerUseProduct): boolean {
  const apiFlag = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT === "true";
  const apiReady =
    typeof window === "undefined"
      ? !!process.env.STRIPE_SECRET_KEY
      : apiFlag;

  if (product) return apiReady || getCheckoutUrl(product) !== null;
  return apiReady || isPaymentLinkConfigured();
}

export function getConfiguredProducts(): PayPerUseProduct[] {
  const apiReady = !!process.env.STRIPE_SECRET_KEY;
  const products = Object.keys(CHECKOUT_ENV_KEYS) as PayPerUseProduct[];
  if (apiReady) return products;
  return products.filter((p) => getCheckoutUrl(p) !== null);
}

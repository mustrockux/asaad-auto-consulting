import type { PayPerUseProduct } from "./pricing";

/**
 * Stripe Payment Links — no monthly fee, pay only per successful charge.
 * Create links at: Stripe Dashboard → Product catalog → Payment links
 *
 * Set success URL in each link to:
 * https://YOUR_DOMAIN/{locale}/payments/success?product=quoteReview
 * (use en, es, or ar — or one link per locale)
 */
const CHECKOUT_ENV_KEYS: Record<PayPerUseProduct, string> = {
  quoteReview: "NEXT_PUBLIC_STRIPE_LINK_QUOTE_REVIEW",
  liveCall: "NEXT_PUBLIC_STRIPE_LINK_LIVE_CALL",
  videoConsult: "NEXT_PUBLIC_STRIPE_LINK_VIDEO_CONSULT",
};

export function getCheckoutUrl(product: PayPerUseProduct): string | null {
  const key = CHECKOUT_ENV_KEYS[product];
  const url = process.env[key];
  return url && url.startsWith("https://") ? url : null;
}

export function isCheckoutConfigured(product?: PayPerUseProduct): boolean {
  if (product) return getCheckoutUrl(product) !== null;
  return (["quoteReview", "liveCall", "videoConsult"] as PayPerUseProduct[]).some(
    (p) => getCheckoutUrl(p) !== null
  );
}

export function getConfiguredProducts(): PayPerUseProduct[] {
  return (["quoteReview", "liveCall", "videoConsult"] as PayPerUseProduct[]).filter(
    (p) => getCheckoutUrl(p) !== null
  );
}

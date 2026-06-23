import Stripe from "stripe";
import type { PayPerUseProduct } from "./pricing";
import { PAY_PER_USE } from "./pricing";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function isStripeApiConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

const PRODUCT_LABELS: Record<
  PayPerUseProduct,
  { name: string; description: string }
> = {
  aiPlus: {
    name: "AI Plus Deep Dive",
    description:
      "Full line-by-line quote breakdown, negotiation scripts, and 24h unlimited Mini Asaad chat.",
  },
  quoteReview: {
    name: "Comprehensive Quote Review by Asaad",
    description:
      "Personal written review of your repair estimate within 24 hours.",
  },
  liveCall: {
    name: "Call or Text Consultation",
    description: "Up to 30 minutes with Asaad by phone call or text message.",
  },
  videoConsult: {
    name: "Video Consultation",
    description: "Live video consult — ideal at the shop or dealership.",
  },
};

export function getStripeProductMeta(product: PayPerUseProduct) {
  return {
    ...PRODUCT_LABELS[product],
    unitAmount: Math.round(PAY_PER_USE[product].price * 100),
  };
}

export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function isValidProduct(value: string): value is PayPerUseProduct {
  return value in PAY_PER_USE;
}

export type PayPerUseProduct = "quoteReview" | "liveCall" | "videoConsult";

export interface PayPerUsePlan {
  id: PayPerUseProduct;
  price: number;
  duration?: string;
  highlight?: boolean;
}

export const PAY_PER_USE: Record<PayPerUseProduct, PayPerUsePlan> = {
  quoteReview: {
    id: "quoteReview",
    price: 29.99,
    highlight: true,
  },
  liveCall: {
    id: "liveCall",
    price: 19.99,
  },
  videoConsult: {
    id: "videoConsult",
    price: 39.99,
  },
};

export const UPSELL_PATHS = {
  quoteToComprehensiveReview: {
    product: "quoteReview" as const,
    price: PAY_PER_USE.quoteReview.price,
  },
  chatToLiveCall: {
    product: "liveCall" as const,
    price: PAY_PER_USE.liveCall.price,
  },
  highRiskToVideo: {
    product: "videoConsult" as const,
    price: PAY_PER_USE.videoConsult.price,
  },
};

export function formatPrice(amount: number, freeLabel = "Free"): string {
  return amount === 0 ? freeLabel : `$${amount.toFixed(2)}`;
}

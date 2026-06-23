export type PayPerUseProduct =
  | "aiPlus"
  | "quoteReview"
  | "liveCall"
  | "videoConsult";

export interface PayPerUsePlan {
  id: PayPerUseProduct;
  price: number;
  duration?: string;
  highlight?: boolean;
}

export const PAY_PER_USE: Record<PayPerUseProduct, PayPerUsePlan> = {
  aiPlus: {
    id: "aiPlus",
    price: 7.99,
    duration: "24h",
    highlight: true,
  },
  quoteReview: {
    id: "quoteReview",
    price: 29.99,
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
  quoteToAiPlus: {
    product: "aiPlus" as const,
    price: PAY_PER_USE.aiPlus.price,
  },
  quoteToComprehensiveReview: {
    product: "quoteReview" as const,
    price: PAY_PER_USE.quoteReview.price,
  },
  chatToAiPlus: {
    product: "aiPlus" as const,
    price: PAY_PER_USE.aiPlus.price,
  },
  chatToLiveCall: {
    product: "liveCall" as const,
    price: PAY_PER_USE.liveCall.price,
  },
  highRiskToAiPlus: {
    product: "aiPlus" as const,
    price: PAY_PER_USE.aiPlus.price,
  },
  highRiskToVideo: {
    product: "videoConsult" as const,
    price: PAY_PER_USE.videoConsult.price,
  },
};

export function formatPrice(amount: number, freeLabel = "Free"): string {
  return amount === 0 ? freeLabel : `$${amount.toFixed(2)}`;
}

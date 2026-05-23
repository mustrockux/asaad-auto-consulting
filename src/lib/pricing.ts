export type Tier = "ai" | "aiPlus" | "human";

export interface PricingItem {
  id: string;
  nameKey: string;
  price: number;
  priceLabel?: string;
  tier: Tier;
  highlight?: boolean;
}

export const PRICING_TIERS = {
  ai: {
    id: "ai" as const,
    price: 0,
    priceLabel: "Free",
  },
  aiPlus: {
    id: "aiPlus" as const,
    price: 4.99,
    priceLabel: "$4.99/mo",
  },
  human: {
    id: "human" as const,
    price: 29.99,
    priceLabel: "$29.99/mo",
  },
};

export const PRICING_ITEMS: PricingItem[] = [
  { id: "ai-quote", nameKey: "aiQuoteAnalysis", price: 0, priceLabel: "Free", tier: "ai", highlight: true },
  { id: "ai-chat", nameKey: "aiChat", price: 0, priceLabel: "Free", tier: "ai" },
  { id: "ai-deal", nameKey: "aiDealCheck", price: 0, priceLabel: "Free", tier: "ai" },
  { id: "ai-plus-quotes", nameKey: "unlimitedAiQuotes", price: 4.99, tier: "aiPlus" },
  { id: "ai-plus-chat", nameKey: "unlimitedAiChat", price: 4.99, tier: "aiPlus" },
  { id: "human-review", nameKey: "asaadQuoteReview", price: 9.99, tier: "human", highlight: true },
  { id: "human-chat", nameKey: "asaadChatSession", price: 14.99, tier: "human" },
  { id: "human-video", nameKey: "asaadVideoCall", price: 24.99, tier: "human" },
  { id: "human-sub", nameKey: "asaadUnlimited", price: 29.99, tier: "human", highlight: true },
];

export const UPSELL_PATHS = {
  quoteToHumanReview: { from: "ai-quote", to: "human-review", price: 9.99 },
  chatToHuman: { from: "ai-chat", to: "human-chat", price: 14.99 },
  highRiskToVideo: { from: "ai-chat", to: "human-video", price: 24.99 },
} as const;

export function formatPrice(amount: number, freeLabel = "Free"): string {
  return amount === 0 ? freeLabel : `$${amount.toFixed(2)}`;
}

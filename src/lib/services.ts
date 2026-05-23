export {
  analyzeQuote,
  analyzeQuoteWithAI,
  type AIQuoteAnalysis,
  type LineItem,
  type UrgencyLevel,
  type Verdict,
  type ItemCategory,
} from "./ai/quote-analyzer";

export { getMiniAsaadResponse, type MiniAsaadResponse, type RiskLevel } from "./ai/mini-asaad";

export { PRICING_TIERS, PRICING_ITEMS, UPSELL_PATHS, formatPrice } from "./pricing";

export function calculateMonthlyPayment(
  principal: number,
  apr: number,
  months: number
): { monthly: number; total: number } {
  const rate = apr / 100 / 12;
  if (rate === 0) {
    const monthly = principal / months;
    return { monthly, total: principal };
  }
  const monthly =
    (principal * rate * Math.pow(1 + rate, months)) /
    (Math.pow(1 + rate, months) - 1);
  return { monthly, total: monthly * months };
}

export function evaluateDeal(
  askingPrice: number,
  marketValue: number
): "good" | "bad" | "unclear" {
  if (askingPrice <= 0 || marketValue <= 0) return "unclear";
  const ratio = askingPrice / marketValue;
  if (ratio <= 1.05) return "good";
  if (ratio >= 1.15) return "bad";
  return "unclear";
}

export type VehicleCondition = "excellent" | "good" | "fair" | "poor";

const conditionMultipliers: Record<VehicleCondition, number> = {
  excellent: 1.1,
  good: 1.0,
  fair: 0.85,
  poor: 0.7,
};

export function estimateMarketValue(
  year: number,
  mileage: number,
  condition: VehicleCondition
): number {
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);
  let value = 28000;
  value -= age * 1400;
  value -= (mileage / 1000) * 75;
  value *= conditionMultipliers[condition] ?? 1;
  return Math.max(2500, Math.round(value));
}

// Legacy type alias
export type QuoteAnalysis = {
  necessary: string[];
  upsell: string[];
  fairPriceMin: number;
  fairPriceMax: number;
  totalQuoted: number;
  urgency: "now" | "soon" | "later";
  verdict: "fair" | "high" | "low";
};

export interface QuoteAnalysis {
  necessary: string[];
  upsell: string[];
  fairPriceMin: number;
  fairPriceMax: number;
  totalQuoted: number;
  urgency: "now" | "soon" | "later";
  verdict: "fair" | "high" | "low";
}

export function analyzeQuote(text: string): QuoteAnalysis {
  const lower = text.toLowerCase();
  const hasBrakes = lower.includes("brake");
  const hasOil = lower.includes("oil");
  const hasFlush = lower.includes("flush");
  const hasFilter = lower.includes("filter");

  const necessary: string[] = [];
  const upsell: string[] = [];

  if (hasBrakes) necessary.push("Brake pad replacement");
  if (hasOil) necessary.push("Oil change");
  if (hasFilter && !hasFlush) necessary.push("Air filter replacement");
  if (hasFlush) upsell.push("Fluid flush (often unnecessary)");
  if (lower.includes("alignment")) upsell.push("Wheel alignment (verify need)");
  if (lower.includes("fuel injection")) upsell.push("Fuel injection cleaning");

  if (necessary.length === 0) {
    necessary.push("Basic inspection items");
  }

  const priceMatch = text.match(/\$[\d,]+(?:\.\d{2})?/g);
  const prices = priceMatch
    ? priceMatch.map((p) => parseFloat(p.replace(/[$,]/g, "")))
    : [450];
  const totalQuoted = Math.max(...prices, 350);

  const fairPriceMin = Math.round(totalQuoted * 0.65);
  const fairPriceMax = Math.round(totalQuoted * 0.85);

  let urgency: QuoteAnalysis["urgency"] = "soon";
  if (hasBrakes && lower.includes("metal")) urgency = "now";
  if (!hasBrakes && !lower.includes("leak")) urgency = "later";

  let verdict: QuoteAnalysis["verdict"] = "fair";
  if (totalQuoted > fairPriceMax * 1.2) verdict = "high";
  if (totalQuoted < fairPriceMin * 0.8) verdict = "low";

  return {
    necessary,
    upsell,
    fairPriceMin,
    fairPriceMax,
    totalQuoted,
    urgency,
    verdict,
  };
}

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

export interface VehicleDetails {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: VehicleCondition;
  askingPrice: number;
}

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

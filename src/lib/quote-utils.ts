import type { AIQuoteAnalysis } from "./services";

export function getFlaggedItemNames(analysis: AIQuoteAnalysis, limit = 3): string[] {
  return [...analysis.upsell, ...analysis.suspicious].slice(0, limit);
}

export function getNegotiationTips(analysis: AIQuoteAnalysis): string[] {
  const tips: string[] = [];

  if (analysis.verdict === "high") {
    tips.push(
      "Ask for a written breakdown of parts vs labor on every line before approving anything."
    );
  }

  if (analysis.upsell.length > 0) {
    tips.push(
      `Decline or defer optional items unless they show test results: ${analysis.upsell.slice(0, 3).join(", ")}.`
    );
  }

  if (analysis.suspicious.length > 0) {
    tips.push(
      `Request proof or a second opinion on: ${analysis.suspicious.slice(0, 2).join(", ")}.`
    );
  }

  if (analysis.savingsPotential > 0) {
    tips.push(
      `Use the fair range ($${analysis.fairPriceMin.toLocaleString()}–$${analysis.fairPriceMax.toLocaleString()}) as your anchor when negotiating.`
    );
  }

  tips.push(
    "Say: \"I'll approve the necessary work today — please remove recommended items and email me a revised total.\""
  );

  return tips;
}

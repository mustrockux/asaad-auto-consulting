import type { AIQuoteAnalysis } from "./quote-analyzer";
import {
  getOpenAIClient,
  OPENAI_MODEL,
  QUOTE_ANALYZER_SYSTEM,
  LOCALE_NAMES,
} from "./openai-client";

function parseAnalysisJson(raw: string): AIQuoteAnalysis | null {
  try {
    const parsed = JSON.parse(raw) as AIQuoteAnalysis;
    if (
      typeof parsed.totalQuoted !== "number" ||
      !Array.isArray(parsed.lineItems) ||
      !parsed.aiSummary
    ) {
      return null;
    }
    return {
      ...parsed,
      necessary: parsed.necessary ?? [],
      upsell: parsed.upsell ?? [],
      suspicious: parsed.suspicious ?? [],
      savingsPotential: parsed.savingsPotential ?? 0,
      overchargePercent: parsed.overchargePercent ?? 0,
    };
  } catch {
    return null;
  }
}

export async function analyzeQuoteWithOpenAI(
  text: string,
  locale = "en"
): Promise<AIQuoteAnalysis | null> {
  const language = LOCALE_NAMES[locale] ?? "English";
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: QUOTE_ANALYZER_SYSTEM },
      {
        role: "user",
        content: `Analyze this repair quote. Write aiSummary and all reason fields in ${language}.\n\nQuote:\n${text}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;
  return parseAnalysisJson(content);
}

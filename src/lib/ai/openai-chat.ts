import type { MiniAsaadResponse } from "./mini-asaad";
import {
  getOpenAIClient,
  OPENAI_MODEL,
  MINI_ASAAD_SYSTEM,
  LOCALE_NAMES,
} from "./openai-client";

function parseChatJson(raw: string): MiniAsaadResponse | null {
  try {
    const parsed = JSON.parse(raw) as MiniAsaadResponse;
    if (!parsed.message || !parsed.riskLevel) return null;
    return {
      message: parsed.message,
      riskLevel: parsed.riskLevel,
      shouldEscalate: Boolean(parsed.shouldEscalate),
      escalationReason: parsed.escalationReason,
      suggestedFollowUp: parsed.suggestedFollowUp,
    };
  } catch {
    return null;
  }
}

export async function chatWithOpenAI(
  message: string,
  locale = "en"
): Promise<MiniAsaadResponse | null> {
  const language = LOCALE_NAMES[locale] ?? "English";
  const openai = getOpenAIClient();

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: MINI_ASAAD_SYSTEM },
      {
        role: "user",
        content: `Respond in ${language}. User message: ${message}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return null;
  return parseChatJson(content);
}

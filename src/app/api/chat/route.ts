import { NextRequest, NextResponse } from "next/server";
import { getMiniAsaadResponse } from "@/lib/ai/mini-asaad";
import { chatWithOpenAI } from "@/lib/ai/openai-chat";
import { isOpenAIConfigured } from "@/lib/ai/openai-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message as string;
    const locale = (body.locale as string) || "en";

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let response = getMiniAsaadResponse(message);
    let source: "openai" | "mini-asaad" = "mini-asaad";

    if (isOpenAIConfigured()) {
      try {
        const gptResponse = await chatWithOpenAI(message, locale);
        if (gptResponse) {
          response = gptResponse;
          source = "openai";
        }
      } catch (err) {
        console.error("OpenAI chat failed, using rules engine:", err);
      }
    }

    return NextResponse.json({ ...response, locale, source });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

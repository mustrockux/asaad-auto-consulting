import { NextRequest, NextResponse } from "next/server";
import { analyzeQuoteWithAI } from "@/lib/ai/quote-analyzer";
import { analyzeQuoteWithOpenAI } from "@/lib/ai/openai-quote";
import { isOpenAIConfigured } from "@/lib/ai/openai-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text as string;
    const locale = (body.locale as string) || "en";

    if (!text?.trim()) {
      return NextResponse.json({ error: "Quote text is required" }, { status: 400 });
    }

    let analysis = analyzeQuoteWithAI(text);
    let source: "openai" | "rules-engine" = "rules-engine";

    if (isOpenAIConfigured()) {
      try {
        const gptAnalysis = await analyzeQuoteWithOpenAI(text, locale);
        if (gptAnalysis) {
          analysis = gptAnalysis;
          source = "openai";
        }
      } catch (err) {
        console.error("OpenAI quote analysis failed, using rules engine:", err);
      }
    }

    return NextResponse.json({ analysis, source });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

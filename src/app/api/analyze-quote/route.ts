import { NextRequest, NextResponse } from "next/server";
import { analyzeQuoteWithAI } from "@/lib/ai/quote-analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text as string;

    if (!text?.trim()) {
      return NextResponse.json({ error: "Quote text is required" }, { status: 400 });
    }

    const analysis = analyzeQuoteWithAI(text);

  // Optional: OpenAI enhancement when API key is configured
    if (process.env.OPENAI_API_KEY) {
      // Future: enrich aiSummary with GPT — fallback to rules engine for now
    }

    return NextResponse.json({ analysis, source: "ai" });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

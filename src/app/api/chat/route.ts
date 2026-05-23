import { NextRequest, NextResponse } from "next/server";
import { getMiniAsaadResponse } from "@/lib/ai/mini-asaad";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message as string;
    const locale = (body.locale as string) || "en";

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = getMiniAsaadResponse(message);

    if (process.env.OPENAI_API_KEY) {
      // Future: GPT-powered Mini Asaad with locale-aware responses
    }

    return NextResponse.json({ ...response, locale, source: "mini-asaad" });
  } catch {
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getStripe, isValidProduct } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ paid: false, status: session.payment_status });
    }

    const product = session.metadata?.product ?? "";
    if (!isValidProduct(product)) {
      return NextResponse.json({ paid: true, product: null });
    }

    return NextResponse.json({
      paid: true,
      product,
      amountTotal: session.amount_total,
      customerEmail: session.customer_details?.email ?? null,
    });
  } catch (err) {
    console.error("Checkout verify error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

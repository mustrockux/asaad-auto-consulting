import { NextRequest, NextResponse } from "next/server";
import { getAppBaseUrl, getStripe, getStripeProductMeta, isValidProduct } from "@/lib/stripe";
import type { PayPerUseProduct } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
    }

    const body = await request.json();
    const product = body.product as string;
    const locale = (body.locale as string) || "en";

    if (!isValidProduct(product)) {
      return NextResponse.json({ error: "Invalid product" }, { status: 400 });
    }

    const meta = getStripeProductMeta(product as PayPerUseProduct);
    const baseUrl = getAppBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: meta.unitAmount,
            product_data: {
              name: meta.name,
              description: meta.description,
            },
          },
        },
      ],
      success_url: `${baseUrl}/${locale}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/payments?canceled=1`,
      metadata: {
        product,
        locale,
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

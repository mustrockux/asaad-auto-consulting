import { setRequestLocale } from "next-intl/server";
import { PaymentSuccess } from "@/components/PaymentSuccess";
import { routing } from "@/i18n/routing";
import type { PayPerUseProduct } from "@/lib/pricing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string; session_id?: string }>;
}) {
  const { locale } = await params;
  const { product, session_id: sessionId } = await searchParams;
  setRequestLocale(locale);

  const validProducts: PayPerUseProduct[] = [
    "aiPlus",
    "quoteReview",
    "liveCall",
    "videoConsult",
  ];
  const resolved = validProducts.includes(product as PayPerUseProduct)
    ? (product as PayPerUseProduct)
    : null;

  return <PaymentSuccess product={resolved} sessionId={sessionId ?? null} />;
}

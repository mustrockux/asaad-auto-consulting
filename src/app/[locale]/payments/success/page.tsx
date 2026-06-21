import { setRequestLocale } from "next-intl/server";
import { PaymentSuccess } from "@/components/PaymentSuccess";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  setRequestLocale(locale);

  const validProducts = ["quoteReview", "liveCall", "videoConsult"] as const;
  const resolved = validProducts.includes(product as (typeof validProducts)[number])
    ? (product as (typeof validProducts)[number])
    : null;

  return <PaymentSuccess product={resolved} />;
}

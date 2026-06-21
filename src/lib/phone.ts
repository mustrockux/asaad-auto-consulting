/**
 * Masked consultation line — set in env, never hardcode a personal number.
 *
 * NEXT_PUBLIC_ASAAD_PHONE_DISPLAY=(888) 555-0147
 * NEXT_PUBLIC_ASAAD_PHONE_TEL=+18885550147
 *
 * Use Google Voice, Twilio, or a business line that forwards to you.
 */

export interface MaskedPhone {
  display: string;
  tel: string;
  isConfigured: boolean;
}

export function getMaskedPhone(): MaskedPhone {
  const display = process.env.NEXT_PUBLIC_ASAAD_PHONE_DISPLAY?.trim() ?? "";
  const tel = process.env.NEXT_PUBLIC_ASAAD_PHONE_TEL?.trim() ?? "";

  if (display && tel) {
    return { display, tel, isConfigured: true };
  }

  // Demo placeholder when not configured (clearly not a real number)
  return {
    display: "(888) 555-0147",
    tel: "",
    isConfigured: false,
  };
}

export function maskPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

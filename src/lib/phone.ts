/**
 * Public consultation line — Google Voice number shown on site.
 *
 * NEXT_PUBLIC_ASAAD_PHONE_DISPLAY=(929) 256-3501
 * NEXT_PUBLIC_ASAAD_PHONE_TEL=+19292563501
 */

export interface MaskedPhone {
  display: string;
  tel: string;
  sms: string;
  isConfigured: boolean;
}

export function toE164US(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (input.startsWith("+")) return input;
  return input;
}

export function formatUSPhone(digits10: string): string {
  const d = digits10.replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return digits10;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function getMaskedPhone(): MaskedPhone {
  const display = process.env.NEXT_PUBLIC_ASAAD_PHONE_DISPLAY?.trim() ?? "";
  const telRaw = process.env.NEXT_PUBLIC_ASAAD_PHONE_TEL?.trim() ?? "";
  const smsRaw =
    process.env.NEXT_PUBLIC_ASAAD_PHONE_SMS?.trim() || telRaw;

  if (display && telRaw) {
    return {
      display,
      tel: toE164US(telRaw),
      sms: toE164US(smsRaw),
      isConfigured: true,
    };
  }

  return {
    display: "(929) 256-3501",
    tel: "+19292563501",
    sms: "+19292563501",
    isConfigured: false,
  };
}

/** @deprecated use formatUSPhone */
export function maskPhoneNumber(raw: string): string {
  return formatUSPhone(raw);
}

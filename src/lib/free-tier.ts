/** Free-tier limits before AI Plus paywall */
export const FREE_TIER_LIMITS = {
  /** Full quote analyses allowed per calendar week */
  quotesPerWeek: 1,
  /** Mini Asaad messages per browser session */
  chatMessagesPerSession: 5,
  /** Mini Asaad messages per calendar day */
  chatMessagesPerDay: 10,
  /** Flagged item names shown on free quote snapshot */
  flaggedItemsPreview: 3,
  /** AI Plus unlock duration after purchase (ms) */
  aiPlusDurationMs: 24 * 60 * 60 * 1000,
} as const;

export function getWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${week}`;
}

export function getDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

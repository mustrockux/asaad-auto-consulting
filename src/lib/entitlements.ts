import type { PayPerUseProduct } from "./pricing";
import { FREE_TIER_LIMITS, getDayKey, getWeekKey } from "./free-tier";

const STORAGE_KEY = "asaad_entitlements";
const SESSION_CHAT_KEY = "asaad_chat_session";

interface EntitlementsState {
  aiPlusExpiresAt: number | null;
  quoteWeekKey: string;
  quoteCountThisWeek: number;
  chatDayKey: string;
  chatMessagesToday: number;
  purchasedProducts: PayPerUseProduct[];
}

function defaultState(): EntitlementsState {
  return {
    aiPlusExpiresAt: null,
    quoteWeekKey: getWeekKey(),
    quoteCountThisWeek: 0,
    chatDayKey: getDayKey(),
    chatMessagesToday: 0,
    purchasedProducts: [],
  };
}

function readState(): EntitlementsState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as EntitlementsState;
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function writeState(state: EntitlementsState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function normalizeRollingCounts(state: EntitlementsState): EntitlementsState {
  const weekKey = getWeekKey();
  const dayKey = getDayKey();
  return {
    ...state,
    quoteWeekKey: weekKey,
    quoteCountThisWeek: state.quoteWeekKey === weekKey ? state.quoteCountThisWeek : 0,
    chatDayKey: dayKey,
    chatMessagesToday: state.chatDayKey === dayKey ? state.chatMessagesToday : 0,
  };
}

export function hasAiPlusAccess(): boolean {
  const state = normalizeRollingCounts(readState());
  writeState(state);
  return !!state.aiPlusExpiresAt && state.aiPlusExpiresAt > Date.now();
}

export function grantAiPlus(): void {
  const state = normalizeRollingCounts(readState());
  state.aiPlusExpiresAt = Date.now() + FREE_TIER_LIMITS.aiPlusDurationMs;
  if (!state.purchasedProducts.includes("aiPlus")) {
    state.purchasedProducts.push("aiPlus");
  }
  writeState(state);
}

export function grantProduct(product: PayPerUseProduct): void {
  if (product === "aiPlus") {
    grantAiPlus();
    return;
  }
  const state = normalizeRollingCounts(readState());
  if (!state.purchasedProducts.includes(product)) {
    state.purchasedProducts.push(product);
  }
  writeState(state);
}

export function canAnalyzeQuote(): { allowed: boolean; reason?: "weekly_limit" } {
  if (hasAiPlusAccess()) return { allowed: true };
  const state = normalizeRollingCounts(readState());
  writeState(state);
  if (state.quoteCountThisWeek >= FREE_TIER_LIMITS.quotesPerWeek) {
    return { allowed: false, reason: "weekly_limit" };
  }
  return { allowed: true };
}

export function recordQuoteAnalysis(): void {
  const state = normalizeRollingCounts(readState());
  state.quoteCountThisWeek += 1;
  writeState(state);
}

function getSessionChatCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(SESSION_CHAT_KEY);
  return raw ? Number.parseInt(raw, 10) || 0 : 0;
}

function setSessionChatCount(count: number): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_CHAT_KEY, String(count));
}

export function canSendChatMessage(): {
  allowed: boolean;
  sessionCount: number;
  dailyCount: number;
  reason?: "session_limit" | "daily_limit";
} {
  if (hasAiPlusAccess()) {
    return { allowed: true, sessionCount: 0, dailyCount: 0 };
  }
  const state = normalizeRollingCounts(readState());
  writeState(state);
  const sessionCount = getSessionChatCount();
  if (sessionCount >= FREE_TIER_LIMITS.chatMessagesPerSession) {
    return {
      allowed: false,
      sessionCount,
      dailyCount: state.chatMessagesToday,
      reason: "session_limit",
    };
  }
  if (state.chatMessagesToday >= FREE_TIER_LIMITS.chatMessagesPerDay) {
    return {
      allowed: false,
      sessionCount,
      dailyCount: state.chatMessagesToday,
      reason: "daily_limit",
    };
  }
  return {
    allowed: true,
    sessionCount,
    dailyCount: state.chatMessagesToday,
  };
}

export function recordChatMessage(): void {
  if (hasAiPlusAccess()) return;
  const state = normalizeRollingCounts(readState());
  state.chatMessagesToday += 1;
  writeState(state);
  setSessionChatCount(getSessionChatCount() + 1);
}

export function getRemainingChatMessages(): { session: number; daily: number } {
  if (hasAiPlusAccess()) {
    return { session: Infinity, daily: Infinity };
  }
  const state = normalizeRollingCounts(readState());
  const sessionCount = getSessionChatCount();
  return {
    session: Math.max(0, FREE_TIER_LIMITS.chatMessagesPerSession - sessionCount),
    daily: Math.max(0, FREE_TIER_LIMITS.chatMessagesPerDay - state.chatMessagesToday),
  };
}

export function getPurchasedProducts(): PayPerUseProduct[] {
  return normalizeRollingCounts(readState()).purchasedProducts;
}

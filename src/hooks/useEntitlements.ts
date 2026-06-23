"use client";

import { useCallback, useEffect, useState } from "react";
import {
  canAnalyzeQuote,
  canSendChatMessage,
  getRemainingChatMessages,
  grantProduct,
  hasAiPlusAccess,
} from "@/lib/entitlements";
import type { PayPerUseProduct } from "@/lib/pricing";

export function useEntitlements() {
  const [hasAiPlus, setHasAiPlus] = useState(false);
  const [chatRemaining, setChatRemaining] = useState({ session: 5, daily: 10 });
  const [quoteAllowed, setQuoteAllowed] = useState(true);

  const refresh = useCallback(() => {
    setHasAiPlus(hasAiPlusAccess());
    setChatRemaining(getRemainingChatMessages());
    setQuoteAllowed(canAnalyzeQuote().allowed);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, [refresh]);

  const unlockProduct = useCallback(
    (product: PayPerUseProduct) => {
      grantProduct(product);
      refresh();
    },
    [refresh]
  );

  return {
    hasAiPlus,
    chatRemaining,
    quoteAllowed,
    refresh,
    unlockProduct,
    canSendChat: () => canSendChatMessage(),
    canAnalyzeQuote: () => canAnalyzeQuote(),
  };
}

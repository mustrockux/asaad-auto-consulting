export type RiskLevel = "low" | "medium" | "high";

export interface MiniAsaadResponse {
  message: string;
  riskLevel: RiskLevel;
  shouldEscalate: boolean;
  escalationReason?: string;
  suggestedFollowUp?: string;
}

interface Pattern {
  test: (msg: string) => boolean;
  response: string;
  risk: RiskLevel;
  escalate?: boolean;
  escalationReason?: string;
}

const PATTERNS: Pattern[] = [
  {
    test: (m) => /\$?\s*800|\b800\b/.test(m) && /brake/i.test(m),
    response:
      "$800 for brakes is on the high end. Basic pad replacement is usually $180–380 depending on your car. If they included rotors, calipers, or 'premium' parts, ask for a breakdown. You may be overpaying by $200–400.",
    risk: "medium",
    escalate: true,
    escalationReason: "Brake pricing is safety-critical and often inflated",
  },
  {
    test: (m) => /flush/i.test(m),
    response:
      "Most flush services are pushed too often. Coolant flush: every 3–5 years for most cars. Transmission flush: check your owner's manual — some manufacturers say never. Brake fluid: every 2–3 years. If they didn't show you test results, this can wait.",
    risk: "low",
  },
  {
    test: (m) => /need.*flush|do i need/i.test(m) && /flush/i.test(m),
    response:
      "Probably not right now. Ask: 'What test showed this is needed?' and 'What does my manual recommend?' If they can't answer clearly, skip it.",
    risk: "low",
  },
  {
    test: (m) => /overcharg|too much|rip.?off|scam/i.test(m),
    response:
      "Trust your gut. Get a second quote from an independent shop — not a chain. Compare line by line. Anything marked 'recommended' or 'suggested' is usually optional.",
    risk: "medium",
    escalate: true,
    escalationReason: "Possible overcharging situation",
  },
  {
    test: (m) => /sign today|pressure|right now|expires today/i.test(m),
    response:
      "Red flag. No legitimate deal requires signing today. Walk away, sleep on it, and compare. Pressure tactics mean they're hiding something.",
    risk: "high",
    escalate: true,
    escalationReason: "High-pressure sales tactic detected",
  },
  {
    test: (m) => /won't start|not starting|dead battery|stranded/i.test(m),
    response:
      "If you're stranded, safety first. A jump or tow may be needed. Battery replacement: $120–250 is fair. Alternator: $400–700. Get the diagnosis in writing before approving anything else.",
    risk: "high",
    escalate: true,
    escalationReason: "Urgent breakdown situation",
  },
  {
    test: (m) => /steering|grinding|metal|vibrat/i.test(m),
    response:
      "Don't ignore steering or grinding noises — especially brakes. This could be safety-critical. Get it checked soon, but still get a second quote before paying.",
    risk: "high",
    escalate: true,
    escalationReason: "Potential safety issue",
  },
  {
    test: (m) => /good deal|fair price|negotiat/i.test(m),
    response:
      "Always negotiate the out-the-door price, not monthly payment. Check CarMax or KBB for your trade-in value before you go. If the price is more than 10% above market, walk.",
    risk: "low",
  },
  {
    test: (m) => /oil change/i.test(m),
    response:
      "Fair oil change: $35–85 for conventional, $55–100 for synthetic. Ignore the 3,000-mile sticker — check your manual. Many modern cars go 5,000–10,000 miles.",
    risk: "low",
  },
  {
    test: (m) => /warranty|extended warranty|gap/i.test(m),
    response:
      "Extended warranties and GAP insurance in the finance office are usually overpriced. Your regular insurance may already cover GAP. Research before you buy — you can often get better rates outside the dealer.",
    risk: "medium",
  },
];

const DEFAULT_RESPONSES = [
  "Tell me more — what's the shop asking you to pay, and for what repair? I can help you figure out if it's fair.",
  "Before you agree to anything, get the estimate in writing and ask which items are required vs recommended.",
  "I'm here to help. Share the price and what's being done — I'll give you a straight answer.",
];

export function getMiniAsaadResponse(userMessage: string): MiniAsaadResponse {
  const msg = userMessage.trim();

  for (const pattern of PATTERNS) {
    if (pattern.test(msg)) {
      return {
        message: pattern.response,
        riskLevel: pattern.risk,
        shouldEscalate: pattern.escalate ?? false,
        escalationReason: pattern.escalationReason,
      };
    }
  }

  const hasPrice = /\$\d+|\d+\s*dollars?/i.test(msg);
  const hasQuestion = /\?|is this|should i|do i|normal|fair/i.test(msg);

  if (hasPrice && hasQuestion) {
    return {
      message:
        "I see a price question. Rule of thumb: if the total is 30%+ above what you'd expect for that job, get a second quote. Tell me the specific repair and I'll give you a fair range.",
      riskLevel: "medium",
      shouldEscalate: false,
      suggestedFollowUp: "Share the exact line items from your estimate",
    };
  }

  return {
    message: DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)],
    riskLevel: "low",
    shouldEscalate: false,
  };
}

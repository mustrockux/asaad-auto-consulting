export type UrgencyLevel = "now" | "soon" | "later";
export type Verdict = "fair" | "high" | "low";
export type ItemCategory = "necessary" | "upsell" | "suspicious";

export interface LineItem {
  name: string;
  quotedPrice: number;
  fairPriceMin: number;
  fairPriceMax: number;
  category: ItemCategory;
  urgency: UrgencyLevel;
  reason: string;
}

export interface AIQuoteAnalysis {
  lineItems: LineItem[];
  necessary: string[];
  upsell: string[];
  suspicious: string[];
  fairPriceMin: number;
  fairPriceMax: number;
  totalQuoted: number;
  urgency: UrgencyLevel;
  verdict: Verdict;
  aiSummary: string;
  savingsPotential: number;
  overchargePercent: number;
}

interface RepairRule {
  patterns: RegExp[];
  name: string;
  fairMin: number;
  fairMax: number;
  category: ItemCategory;
  urgency: UrgencyLevel;
  reason: string;
}

const REPAIR_RULES: RepairRule[] = [
  {
    patterns: [/brake\s*pad/i, /brake\s*job/i, /brakes/i],
    name: "Brake pad replacement",
    fairMin: 180,
    fairMax: 380,
    category: "necessary",
    urgency: "now",
    reason: "Safety-critical — but price varies by vehicle",
  },
  {
    patterns: [/oil\s*change/i, /synthetic\s*oil/i],
    name: "Oil change",
    fairMin: 35,
    fairMax: 85,
    category: "necessary",
    urgency: "soon",
    reason: "Routine maintenance",
  },
  {
    patterns: [/coolant\s*flush/i, /radiator\s*flush/i],
    name: "Coolant flush",
    fairMin: 80,
    fairMax: 150,
    category: "upsell",
    urgency: "later",
    reason: "Often pushed every visit — most cars need this every 3–5 years",
  },
  {
    patterns: [/transmission\s*flush/i],
    name: "Transmission flush",
    fairMin: 120,
    fairMax: 250,
    category: "upsell",
    urgency: "later",
    reason: "Verify against manufacturer schedule before agreeing",
  },
  {
    patterns: [/fuel\s*injection/i, /fuel\s*system\s*clean/i],
    name: "Fuel injection cleaning",
    fairMin: 0,
    fairMax: 120,
    category: "upsell",
    urgency: "later",
    reason: "Rarely needed on modern fuel-injected engines",
  },
  {
    patterns: [/alignment/i, /wheel\s*align/i],
    name: "Wheel alignment",
    fairMin: 75,
    fairMax: 150,
    category: "upsell",
    urgency: "soon",
    reason: "Only needed if tires wear unevenly or after suspension work",
  },
  {
    patterns: [/air\s*filter/i],
    name: "Air filter replacement",
    fairMin: 20,
    fairMax: 50,
    category: "necessary",
    urgency: "later",
    reason: "Simple maintenance item",
  },
  {
    patterns: [/cabin\s*filter/i],
    name: "Cabin air filter",
    fairMin: 25,
    fairMax: 60,
    category: "necessary",
    urgency: "later",
    reason: "Easy DIY — shops often overcharge",
  },
  {
    patterns: [/diagnostic/i, /inspection\s*fee/i, /shop\s*fee/i],
    name: "Diagnostic / shop fee",
    fairMin: 50,
    fairMax: 150,
    category: "suspicious",
    urgency: "soon",
    reason: "Ask what it covers — some shops waive this if you approve repairs",
  },
  {
    patterns: [/battery/i],
    name: "Battery replacement",
    fairMin: 120,
    fairMax: 250,
    category: "necessary",
    urgency: "now",
    reason: "Needed if car won't start reliably",
  },
  {
    patterns: [/tire\s*rotat/i],
    name: "Tire rotation",
    fairMin: 25,
    fairMax: 50,
    category: "necessary",
    urgency: "later",
    reason: "Often free at tire shops",
  },
  {
    patterns: [/serpentine\s*belt/i, /drive\s*belt/i],
    name: "Serpentine belt",
    fairMin: 100,
    fairMax: 220,
    category: "necessary",
    urgency: "soon",
    reason: "Prevents breakdown if cracked or worn",
  },
];

function parseLineItems(text: string): { name: string; price: number }[] {
  const items: { name: string; price: number }[] = [];
  const lines = text.split(/[\n,;]+/);

  for (const line of lines) {
    const priceMatch = line.match(/\$?\s*([\d,]+(?:\.\d{2})?)/);
    if (!priceMatch) continue;
    const price = parseFloat(priceMatch[1].replace(/,/g, ""));
    const name = line.replace(/\$?\s*[\d,]+(?:\.\d{2})?/g, "").replace(/total/i, "").trim();
    if (name.length > 2 && price > 0 && !/total/i.test(name)) {
      items.push({ name, price });
    }
  }

  return items;
}

function matchRule(text: string, itemName: string): RepairRule | null {
  const combined = `${text} ${itemName}`.toLowerCase();
  for (const rule of REPAIR_RULES) {
    if (rule.patterns.some((p) => p.test(combined))) return rule;
  }
  return null;
}

function urgencyRank(u: UrgencyLevel): number {
  return u === "now" ? 3 : u === "soon" ? 2 : 1;
}

export function analyzeQuoteWithAI(text: string): AIQuoteAnalysis {
  const lower = text.toLowerCase();
  const parsed = parseLineItems(text);
  const lineItems: LineItem[] = [];
  const matchedRules = new Set<string>();

  for (const parsedItem of parsed) {
    const rule = matchRule(text, parsedItem.name);
    if (rule && !matchedRules.has(rule.name)) {
      matchedRules.add(rule.name);
      lineItems.push({
        name: rule.name,
        quotedPrice: parsedItem.price,
        fairPriceMin: rule.fairMin,
        fairPriceMax: rule.fairMax,
        category: rule.category,
        urgency: rule.urgency,
        reason: rule.reason,
      });
    } else if (!rule) {
      lineItems.push({
        name: parsedItem.name,
        quotedPrice: parsedItem.price,
        fairPriceMin: Math.round(parsedItem.price * 0.6),
        fairPriceMax: Math.round(parsedItem.price * 0.85),
        category: parsedItem.price > 200 ? "suspicious" : "necessary",
        urgency: "soon",
        reason: "Unrecognized item — verify necessity with a second opinion",
      });
    }
  }

  if (lineItems.length === 0) {
    for (const rule of REPAIR_RULES) {
      if (rule.patterns.some((p) => p.test(lower)) && !matchedRules.has(rule.name)) {
        matchedRules.add(rule.name);
        const mid = Math.round((rule.fairMin + rule.fairMax) / 2);
        lineItems.push({
          name: rule.name,
          quotedPrice: mid,
          fairPriceMin: rule.fairMin,
          fairPriceMax: rule.fairMax,
          category: rule.category,
          urgency: rule.urgency,
          reason: rule.reason,
        });
      }
    }
  }

  const totalMatch = text.match(/total\s*[:\-]?\s*\$?\s*([\d,]+(?:\.\d{2})?)/i);
  const allPrices = text.match(/\$[\d,]+(?:\.\d{2})?/g)?.map((p) => parseFloat(p.replace(/[$,]/g, ""))) ?? [];
  const totalQuoted = totalMatch
    ? parseFloat(totalMatch[1].replace(/,/g, ""))
    : lineItems.length > 0
      ? lineItems.reduce((s, i) => s + i.quotedPrice, 0)
      : Math.max(...allPrices, 450);

  const fairPriceMin = lineItems.reduce((s, i) => s + i.fairPriceMin, 0) || Math.round(totalQuoted * 0.55);
  const fairPriceMax = lineItems.reduce((s, i) => s + i.fairPriceMax, 0) || Math.round(totalQuoted * 0.8);
  const savingsPotential = Math.max(0, totalQuoted - fairPriceMax);
  const overchargePercent = fairPriceMax > 0 ? Math.round(((totalQuoted - fairPriceMax) / fairPriceMax) * 100) : 0;

  const necessary = lineItems.filter((i) => i.category === "necessary").map((i) => i.name);
  const upsell = lineItems.filter((i) => i.category === "upsell").map((i) => i.name);
  const suspicious = lineItems.filter((i) => i.category === "suspicious").map((i) => i.name);

  const overallUrgency = lineItems.reduce<UrgencyLevel>(
    (max, i) => (urgencyRank(i.urgency) > urgencyRank(max) ? i.urgency : max),
    "later"
  );

  if (lower.includes("metal") || lower.includes("grinding")) {
    lineItems.forEach((i) => {
      if (/brake/i.test(i.name)) i.urgency = "now";
    });
  }

  let verdict: Verdict = "fair";
  if (totalQuoted > fairPriceMax * 1.15 || upsell.length >= 2) verdict = "high";
  if (totalQuoted < fairPriceMin * 0.75) verdict = "low";

  let aiSummary: string;
  if (verdict === "high") {
    aiSummary = `You're likely being overcharged by ~$${savingsPotential.toLocaleString()} (${overchargePercent}% above fair range). ${upsell.length} item(s) look like common upsells.`;
  } else if (verdict === "low") {
    aiSummary = "This price seems unusually low. Verify they're using quality parts and not cutting corners.";
  } else {
    aiSummary = `Overall this quote is within a reasonable range. Watch the ${upsell.length > 0 ? "optional items" : "line items"} before signing.`;
  }

  return {
    lineItems,
    necessary: necessary.length ? necessary : ["Review each line item carefully"],
    upsell,
    suspicious,
    fairPriceMin,
    fairPriceMax,
    totalQuoted,
    urgency: overallUrgency,
    verdict,
    aiSummary,
    savingsPotential,
    overchargePercent: Math.max(0, overchargePercent),
  };
}

// Backward-compatible export for existing code
export function analyzeQuote(text: string) {
  const ai = analyzeQuoteWithAI(text);
  return {
    necessary: ai.necessary,
    upsell: ai.upsell,
    fairPriceMin: ai.fairPriceMin,
    fairPriceMax: ai.fairPriceMax,
    totalQuoted: ai.totalQuoted,
    urgency: ai.urgency,
    verdict: ai.verdict,
  };
}

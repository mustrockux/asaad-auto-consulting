# Asaad Auto Consulting

**Don't Get Taken for a Ride.**

A responsive multilingual web app that gives users instant, trustworthy automotive advice in English, Spanish, and Arabic.

## Features (MVP)

- **Quote Review** — Upload repair estimates, get honest breakdowns (necessary vs upsell, fair price, urgency)
- **Ask Asaad Now** — One-click chat, call, or video help
- **Car Buying Assistant** — Deal checker, dealer red flags, financing calculator
- **Chat** — Ongoing thread with translation toggle (view original / translated)
- **Knowledge Library** — Curated articles on scams, myths, and dealer tricks (all 3 languages)
- **Payments** — Pay-per-use and subscription pricing UI
- **Dashboard** — Activity and saved reports

## Languages

| Language | Code | RTL |
|----------|------|-----|
| English  | `en` | No  |
| Spanish  | `es` | No  |
| Arabic   | `ar` | Yes |

Language selector appears on first visit and persists in the header.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- next-intl for i18n
- Lucide icons

## Getting Started

```bash
cd ~/projects/asaad-auto-consulting
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.

## Project Structure

```
src/
  app/[locale]/     # Localized routes
  components/       # UI components
  i18n/             # Routing & navigation
  messages/         # en.json, es.json, ar.json
  lib/              # Services & data
```

## Design

- Dark mode by default (charcoal/black + deep red accents)
- Mobile-first, large CTAs for stressful situations
- RTL layout for Arabic with Noto Sans Arabic font

## Next Steps (V2)

- Connect real AI backend for quote analysis and chat
- Stripe payment integration
- Voice input in all languages
- Regional scam alerts

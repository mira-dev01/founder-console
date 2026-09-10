import { ProviderDefinition } from "./types";

/**
 * All providers MIRA's backend depends on. Every entry starts as "reference" — a
 * provider only flips to "live" once a fetcher for it has been built and verified
 * against that provider's actual API with a real key (see providers/live/*).
 *
 * Order matches the integration list this app was scaffolded from. Update
 * referenceReason once a provider's API availability has actually been checked
 * against current docs, not before.
 */
export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "twilio",
    name: "Twilio",
    usage: "Guest/host WhatsApp messages, escalations, optional Voice fallback",
    dashboardUrl: "https://console.twilio.com/us1/monitor/usage",
    status: "reference",
    referenceReason:
      "Twilio has a real Usage Records API and Balance API — high confidence this can go live. Not wired yet.",
  },
  {
    id: "groq",
    name: "Groq",
    usage: "Primary LLM for the voice agent's function-calling",
    dashboardUrl: "https://console.groq.com/",
    status: "reference",
    referenceReason:
      "Unverified whether Groq's public API exposes account-level usage/credits. Not wired yet.",
  },
  {
    id: "sarvam",
    name: "Sarvam AI",
    usage: "STT + TTS for the voice pipeline",
    dashboardUrl: "https://dashboard.sarvam.ai/",
    status: "reference",
    referenceReason:
      "Niche provider — unverified whether any usage API exists. Not wired yet.",
  },
  {
    id: "exotel",
    name: "Exotel",
    usage: "Telephony/call routing (the real guest-call path)",
    dashboardUrl: "https://my.exotel.com/",
    status: "reference",
    referenceReason:
      "Unverified whether Exotel's API exposes account balance or call-minute usage. Not wired yet.",
  },
  {
    id: "bright-data",
    name: "Bright Data",
    usage: "Airbnb listing scraping on property import",
    dashboardUrl: "https://brightdata.com/cp/dashboard",
    status: "reference",
    referenceReason:
      "Likely has an account/usage API — unverified. Not wired yet.",
  },
  {
    id: "searchapi",
    name: "SearchApi.io",
    usage: "Live Airbnb pricing lookups",
    dashboardUrl: "https://www.searchapi.io/dashboard",
    status: "reference",
    referenceReason: "Unverified whether a usage API exists. Not wired yet.",
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    usage: "Re-hosting property photos",
    dashboardUrl: "https://console.cloudinary.com/",
    status: "reference",
    referenceReason:
      "Has a documented Admin API usage endpoint — high confidence this can go live. Not wired yet.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    usage: "LLM fallback path",
    dashboardUrl: "https://openrouter.ai/credits",
    status: "reference",
    referenceReason:
      "OpenRouter has historically exposed a credits/usage endpoint — unverified against current docs. Not wired yet.",
  },
  {
    id: "smtp",
    name: "SMTP",
    usage: "Escalation emails (provider varies — Gmail/Zoho/SES/etc, whatever's configured)",
    status: "reference",
    referenceReason:
      "Provider-dependent; likely no generic usage API. Expected to stay a static reference row — check whatever SMTP provider is actually configured for a billing dashboard link.",
  },
  {
    id: "clerk",
    name: "Clerk",
    usage: "Auth for MIRA's own host dashboard (not this app)",
    dashboardUrl: "https://dashboard.clerk.com/",
    status: "reference",
    referenceReason:
      "Usage-based billing exists but this is low priority to wire live. Not wired yet.",
  },
  {
    id: "railway",
    name: "Railway",
    usage: "Hosts MIRA's backend",
    dashboardUrl: "https://railway.app/dashboard",
    status: "reference",
    referenceReason:
      "Has a GraphQL API that can expose project usage/spend — unverified. Not wired yet.",
  },
  {
    id: "vercel",
    name: "Vercel",
    usage: "Hosts MIRA's frontend (and this app)",
    dashboardUrl: "https://vercel.com/dashboard",
    status: "reference",
    referenceReason: "Has a usage API — unverified against current docs. Not wired yet.",
  },
  {
    id: "neon",
    name: "Neon",
    usage: "Database (verify DATABASE_URL's host is actually Neon)",
    dashboardUrl: "https://console.neon.tech/",
    status: "reference",
    referenceReason:
      "Neon has an API for compute/storage usage — unverified. Not wired yet.",
  },
  {
    id: "redis",
    name: "Redis",
    usage: "Caching + call-coordination leases (check whether this is Upstash or a Railway addon)",
    dashboardUrl: "https://console.upstash.com/",
    status: "reference",
    referenceReason:
      "Depends which provider is actually in use — Upstash has a usage API, a Railway addon may not expose one separately. Not wired yet.",
  },
];

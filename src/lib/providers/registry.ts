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
    status: "live",
  },
  {
    id: "groq",
    name: "Groq",
    usage: "Primary LLM for the voice agent's function-calling",
    dashboardUrl: "https://console.groq.com/",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: Groq has no public account-level usage/credits API — only rate-limit headers on inference responses and a dashboard. Staying reference.",
  },
  {
    id: "sarvam",
    name: "Sarvam AI",
    usage: "STT + TTS for the voice pipeline",
    dashboardUrl: "https://dashboard.sarvam.ai/",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: no documented API for credit balance — only a dashboard usage page (dashboard.sarvam.ai/usage). Staying reference.",
  },
  {
    id: "exotel",
    name: "Exotel",
    usage: "Telephony/call routing (the real guest-call path)",
    dashboardUrl: "https://my.exotel.com/",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: Exotel does have a Balance API (GET /v1/Accounts/{sid}/Balance.json, Basic Auth), but the current EXOTEL_API_KEY/TOKEN/SID got a 403 \"Authorization failed\" against api.exotel.com, api.in.exotel.com, and api.exotel.in. Likely the wrong region subdomain or a key scoped without account-balance access — needs corrected credentials from the Exotel dashboard before this can go live.",
  },
  {
    id: "bright-data",
    name: "Bright Data",
    usage: "Airbnb listing scraping on property import",
    dashboardUrl: "https://brightdata.com/cp/dashboard",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: Bright Data has a real endpoint (GET api.brightdata.com/customer/balance, Bearer auth), but the current BRIGHT_DATA_API_KEY got a 403 — \"API key lacks the required permissions for this action.\" Needs a token with account-management scope from brightdata.com/cp/setting/users.",
  },
  {
    id: "searchapi",
    name: "SearchApi.io",
    usage: "Live Airbnb pricing lookups",
    dashboardUrl: "https://www.searchapi.io/dashboard",
    status: "live",
  },
  {
    id: "cloudinary",
    name: "Cloudinary",
    usage: "Re-hosting property photos",
    dashboardUrl: "https://console.cloudinary.com/",
    status: "live",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    usage: "LLM fallback path",
    dashboardUrl: "https://openrouter.ai/credits",
    status: "live",
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
      "Checked 2026-09-11: Clerk's Billing API lets Clerk's customers bill their OWN end users — it doesn't expose what Clerk charges us (monthly retained users / invoice) anywhere but the dashboard. No API for that. Staying reference.",
  },
  {
    id: "railway",
    name: "Railway",
    usage: "Hosts MIRA's backend",
    dashboardUrl: "https://railway.app/dashboard",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: real GraphQL API at backboard.railway.com/graphql/v2 (Bearer token from an account or Project-Access-Token). Haven't built/tested the actual usage query yet, and no RAILWAY_API_TOKEN/RAILWAY_PROJECT_ID added — add those and I'll wire and verify it.",
  },
  {
    id: "vercel",
    name: "Vercel",
    usage: "Hosts MIRA's frontend (and this app)",
    dashboardUrl: "https://vercel.com/dashboard",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: Vercel has multiple real usage/billing endpoints (/v1/billing/charges in FOCUS format, AI Gateway's /v1/credits, /v1/report for aggregated spend — Hobby/Pro-trial excluded from /v1/report). Need to pick the right one and test against a real token — no VERCEL_API_TOKEN/VERCEL_TEAM_ID added yet.",
  },
  {
    id: "neon",
    name: "Neon",
    usage: "Database (verify DATABASE_URL's host is actually Neon)",
    dashboardUrl: "https://console.neon.tech/",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: Neon has a project consumption-metrics API for usage-based plans (compute in CU-seconds, storage in bytes/hour) — matches the invoice. The old account-level endpoint is deprecated (sunsetting 2026-06-01), so this needs the current project-scoped one. No NEON_API_KEY/NEON_PROJECT_ID added yet.",
  },
  {
    id: "redis",
    name: "Redis",
    usage: "Caching + call-coordination leases (check whether this is Upstash or a Railway addon)",
    dashboardUrl: "https://console.upstash.com/",
    status: "reference",
    referenceReason:
      "Checked 2026-09-11: REDIS_URL in mira-prod points at an Upstash host (charmed-hyena-...upstash.io), so this is Upstash, not a Railway addon. Upstash's Developer API has a GET /v2/redis/stats/{id} endpoint (separate from the REST data-plane API/token) with connection/throughput/disk stats — needs UPSTASH_REDIS_REST_URL/TOKEN plus a Developer API key to wire and verify.",
  },
];

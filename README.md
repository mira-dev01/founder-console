# MIRA Founder Console

Internal-only dashboard showing real-time credit balances and usage for every
third-party API MIRA's production backend depends on (Twilio, Groq, Cloudinary,
etc). Not a product feature, not a business-metrics dashboard — just "are we about
to run out of X credits."

This is a separate app and deployment from `mira-prod`. It does not share a
database, environment variables, or code with that repo — it only talks to each
provider's own API using its own copies of credentials.

## Status

Currently all providers are shown as **reference** cards (name, what MIRA uses it
for, a link to that provider's own dashboard). Live cards get added one provider at
a time, only once a fetcher has been built and verified to return real data against
that provider's actual current API docs — see [`src/lib/providers/registry.ts`](src/lib/providers/registry.ts)
for per-provider status and notes.

## Auth

Single shared passcode, not per-person accounts:

- `FOUNDER_PASSCODE` gates every route via [`src/middleware.ts`](src/middleware.ts).
- On success, a signed httpOnly session cookie is set (`SESSION_SECRET` signs it) —
  the raw passcode is never stored client-side.
- Login attempts are rate-limited in-memory per IP (5 attempts / 10 min).

## Getting started

```bash
cp .env.example .env.local
# fill in FOUNDER_PASSCODE and SESSION_SECRET at minimum:
#   openssl rand -hex 32   # for SESSION_SECRET
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to
`/login`.

## Adding a live provider card

1. Confirm against that provider's *current* docs that a usage/balance API exists
   and that our account tier can reach it. Don't assume the table in the original
   spec is still accurate.
2. Add a server-side fetcher (Route Handler or server-only module — never expose
   the key to the client) with sensible caching (these are billing endpoints, a
   few-minutes cache is fine).
3. Add the provider's env vars to `.env.example` with a comment on where to find
   them in that provider's dashboard.
4. Flip the provider's `status` to `"live"` in `registry.ts` only after verifying
   it returns real data with a real key.

## Deployment

Target: Vercel, on `console.hostwithmira.com`.

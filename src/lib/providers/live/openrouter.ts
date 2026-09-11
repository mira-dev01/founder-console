import { LiveProviderData } from "../types";

// Verified against real OpenRouter account, 2026-09-11:
// GET /api/v1/credits -> { data: { total_credits, total_usage } }
// (requires the key to be a "management" key — a provisioning key works; some
// scoped inference-only keys get a 403 here)
export async function fetchOpenRouterLiveData(): Promise<LiveProviderData> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const lastCheckedAt = new Date().toISOString();

  if (!apiKey) {
    return { lastCheckedAt, error: "Missing OPENROUTER_API_KEY" };
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/credits", {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Credits API returned ${res.status}`);
    }

    const { data } = await res.json();
    const remaining = data.total_credits - data.total_usage;

    return {
      balance: `${remaining.toFixed(2)} credits remaining`,
      usageThisPeriod: `${data.total_usage.toFixed(2)} of ${data.total_credits.toFixed(2)} credits used (all-time)`,
      lastCheckedAt,
    };
  } catch (err) {
    return { lastCheckedAt, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

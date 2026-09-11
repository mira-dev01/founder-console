import { LiveProviderData } from "../types";

// Verified against real SearchApi.io account, 2026-09-11:
// GET /api/v1/me -> { account: { current_month_usage, monthly_allowance,
// remaining_credits }, api_usage: { searches_this_hour, hourly_rate_limit } }
export async function fetchSearchApiLiveData(): Promise<LiveProviderData> {
  const apiKey = process.env.SEARCHAPI_API_KEY;
  const lastCheckedAt = new Date().toISOString();

  if (!apiKey) {
    return { lastCheckedAt, error: "Missing SEARCHAPI_API_KEY" };
  }

  try {
    const res = await fetch("https://www.searchapi.io/api/v1/me", {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Account API returned ${res.status}`);
    }

    const data = await res.json();
    const account = data.account ?? {};

    return {
      balance:
        typeof account.remaining_credits === "number"
          ? `${account.remaining_credits} credits remaining`
          : undefined,
      usageThisPeriod:
        typeof account.current_month_usage === "number" && typeof account.monthly_allowance === "number"
          ? `${account.current_month_usage} / ${account.monthly_allowance} searches this month`
          : undefined,
      lastCheckedAt,
    };
  } catch (err) {
    return { lastCheckedAt, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

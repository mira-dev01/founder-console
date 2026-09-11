import { LiveProviderData } from "../types";

// Verified against real Twilio account, 2026-09-11:
// - Balance API: GET /Accounts/{Sid}/Balance.json -> { balance, currency, account_sid }
// - Usage Records API: filtering Category=totalprice returns one aggregate record
//   for the period instead of per-category rows that would double-count if summed.
export async function fetchTwilioLiveData(): Promise<LiveProviderData> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const lastCheckedAt = new Date().toISOString();

  if (!sid || !token) {
    return { lastCheckedAt, error: "Missing TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN" };
  }

  const authHeader = `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`;

  try {
    const [balanceRes, usageRes] = await Promise.all([
      fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Balance.json`, {
        headers: { Authorization: authHeader },
        next: { revalidate: 300 },
      }),
      fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Usage/Records/ThisMonth.json?Category=totalprice&PageSize=1`,
        { headers: { Authorization: authHeader }, next: { revalidate: 300 } },
      ),
    ]);

    if (!balanceRes.ok) {
      throw new Error(`Balance API returned ${balanceRes.status}`);
    }
    const balance: { balance: string; currency: string } = await balanceRes.json();

    let usageThisPeriod: string | undefined;
    if (usageRes.ok) {
      const usage = await usageRes.json();
      const record = usage.usage_records?.[0];
      if (record) {
        usageThisPeriod = `${record.price} ${record.price_unit?.toUpperCase()} this month`;
      }
    }

    return {
      balance: `${balance.balance} ${balance.currency}`,
      usageThisPeriod,
      lastCheckedAt,
    };
  } catch (err) {
    return { lastCheckedAt, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

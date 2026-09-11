import { LiveProviderData } from "../types";

// Verified against real Cloudinary account, 2026-09-11:
// GET /v1_1/{cloud_name}/usage -> { plan, credits: { usage, limit, used_percent },
// storage: { usage: bytes }, bandwidth: { usage: bytes }, ... }
export async function fetchCloudinaryLiveData(): Promise<LiveProviderData> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const lastCheckedAt = new Date().toISOString();

  if (!cloudName || !apiKey || !apiSecret) {
    return { lastCheckedAt, error: "Missing Cloudinary credentials" };
  }

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/usage`, {
      headers: { Authorization: authHeader },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Cloudinary usage API returned ${res.status}`);
    }

    const data = await res.json();
    const credits: { usage: number; limit: number; used_percent: number } | undefined = data.credits;

    const balance = credits
      ? `${(credits.limit - credits.usage).toFixed(1)} credits left of ${credits.limit} (${credits.used_percent.toFixed(1)}% used)`
      : undefined;

    const storageGb = typeof data.storage?.usage === "number" ? data.storage.usage / 1e9 : undefined;
    const bandwidthGb = typeof data.bandwidth?.usage === "number" ? data.bandwidth.usage / 1e9 : undefined;
    const usageThisPeriod =
      storageGb !== undefined && bandwidthGb !== undefined
        ? `${storageGb.toFixed(2)} GB stored, ${bandwidthGb.toFixed(2)} GB bandwidth (${data.plan} plan)`
        : undefined;

    return { balance, usageThisPeriod, lastCheckedAt };
  } catch (err) {
    return { lastCheckedAt, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

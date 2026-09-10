export type ProviderStatus = "live" | "reference";

export interface ProviderDefinition {
  id: string;
  name: string;
  /** What MIRA's backend uses this provider for. */
  usage: string;
  /** Where a human checks this provider's balance/usage manually. Omitted when the
   * provider varies by deployment (e.g. SMTP) and there's no single dashboard to link. */
  dashboardUrl?: string;
  status: ProviderStatus;
  /** Shown on reference cards: why this one isn't live (no API, needs a higher tier, etc). */
  referenceReason?: string;
}

export interface LiveProviderData {
  balance?: string;
  usageThisPeriod?: string;
  lastCheckedAt: string;
  error?: string;
}

export interface ProviderCardData extends ProviderDefinition {
  live?: LiveProviderData;
}

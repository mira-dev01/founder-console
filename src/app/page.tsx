import { PROVIDERS } from "@/lib/providers/registry";
import { LIVE_FETCHERS } from "@/lib/providers/live";
import { ProviderCardData } from "@/lib/providers/types";
import { ProviderCard } from "@/components/ProviderCard";
import { LogoutButton } from "@/components/LogoutButton";

async function getProviders(): Promise<ProviderCardData[]> {
  return Promise.all(
    PROVIDERS.map(async (provider): Promise<ProviderCardData> => {
      const fetchLive = LIVE_FETCHERS[provider.id];
      if (!fetchLive) return provider;

      try {
        return { ...provider, live: await fetchLive() };
      } catch (err) {
        return {
          ...provider,
          live: {
            lastCheckedAt: new Date().toISOString(),
            error: err instanceof Error ? err.message : "Unknown error",
          },
        };
      }
    }),
  );
}

export default async function Home() {
  const providers = await getProviders();
  const sorted = [...providers].sort((a, b) => {
    if (a.status === b.status) return 0;
    return a.status === "live" ? -1 : 1;
  });

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-neutral-100">
              MIRA Founder Console
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Third-party API credit balances and usage for MIRA&apos;s production
              dependencies. Not a product dashboard.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </div>
  );
}

import { ProviderCardData } from "@/lib/providers/types";

export function ProviderCard({ provider }: { provider: ProviderCardData }) {
  const isLive = provider.status === "live";

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-medium text-neutral-100">{provider.name}</h2>
        <StatusBadge status={provider.status} />
      </div>

      <p className="text-sm text-neutral-400">{provider.usage}</p>

      {isLive && provider.live ? (
        <LiveDetails live={provider.live} />
      ) : (
        <p className="text-xs text-neutral-500">{provider.referenceReason}</p>
      )}

      {provider.dashboardUrl && (
        <a
          href={provider.dashboardUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-auto text-sm text-neutral-300 underline decoration-neutral-700 underline-offset-2 hover:text-neutral-100"
        >
          Open {provider.name} dashboard →
        </a>
      )}
    </div>
  );
}

function LiveDetails({ live }: { live: ProviderCardData["live"] }) {
  if (!live) return null;

  if (live.error) {
    return (
      <p className="rounded border border-red-900/50 bg-red-950/30 px-2 py-1.5 text-xs text-red-300">
        Fetch failed: {live.error}
      </p>
    );
  }

  return (
    <div className="space-y-1 text-sm">
      {live.balance && (
        <p className="text-neutral-200">
          Balance: <span className="font-medium">{live.balance}</span>
        </p>
      )}
      {live.usageThisPeriod && (
        <p className="text-neutral-200">
          Usage this period: <span className="font-medium">{live.usageThisPeriod}</span>
        </p>
      )}
      <p className="text-xs text-neutral-500">Last checked: {live.lastCheckedAt}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProviderCardData["status"] }) {
  if (status === "live") {
    return (
      <span className="shrink-0 rounded-full border border-emerald-800 bg-emerald-950/50 px-2 py-0.5 text-xs font-medium text-emerald-400">
        live
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full border border-neutral-700 bg-neutral-800/50 px-2 py-0.5 text-xs font-medium text-neutral-400">
      reference
    </span>
  );
}

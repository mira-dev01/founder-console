"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        return;
      }

      const from = searchParams.get("from") || "/";
      router.push(from);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-lg font-semibold text-neutral-100">
          MIRA Founder Console
        </h1>
        <p className="mb-6 text-sm text-neutral-500">
          Internal only. Enter the shared passcode.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-600 focus:outline-none"
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !passcode}
            className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
          >
            {submitting ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// In-memory fixed-window limiter. Good enough for a single small Vercel deployment
// gating a passcode field — not durable across instances/restarts, which is fine here.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const attempts = new Map<string, { count: number; resetAt: number }>();

export function isRateLimited(key: string): boolean {
  const entry = attempts.get(key);
  const now = Date.now();
  if (!entry || now > entry.resetAt) return false;
  return entry.count >= MAX_ATTEMPTS;
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}

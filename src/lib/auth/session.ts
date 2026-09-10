import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = "mira_founder_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET is not set. Add it to your environment (see .env.example).",
    );
  }
  return secret;
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (padded.length % 4)) % 4;
  const binary = atob(padded + "=".repeat(padLength));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return toBase64Url(signature);
}

/** Builds a signed session token: base64url(payload).base64url(hmac signature). */
export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });
  const encodedPayload = toBase64Url(new TextEncoder().encode(payload));
  const signature = await sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/** Verifies signature and expiry. Returns true only for an untampered, unexpired token. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = await sign(encodedPayload);
  if (!timingSafeEqual(signature, expectedSignature)) return false;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encodedPayload)));
    if (typeof payload.exp !== "number") return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function setSessionCookie(): Promise<void> {
  const token = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

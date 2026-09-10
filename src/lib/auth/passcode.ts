/** Constant-time passcode check: compares HMAC digests (fixed length) rather than
 * raw strings, so neither timing nor length leaks information about the secret. */
export async function verifyPasscode(candidate: string): Promise<boolean> {
  const expected = process.env.FOUNDER_PASSCODE;
  if (!expected) {
    throw new Error(
      "FOUNDER_PASSCODE is not set. Add it to your environment (see .env.example).",
    );
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(expected),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const [candidateDigest, expectedDigest] = await Promise.all([
    crypto.subtle.sign("HMAC", key, new TextEncoder().encode(candidate)),
    crypto.subtle.sign("HMAC", key, new TextEncoder().encode(expected)),
  ]);

  const a = new Uint8Array(candidateDigest);
  const b = new Uint8Array(expectedDigest);
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}

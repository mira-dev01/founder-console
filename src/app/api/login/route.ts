import { NextRequest, NextResponse } from "next/server";
import { verifyPasscode } from "@/lib/auth/passcode";
import { setSessionCookie } from "@/lib/auth/session";
import { isRateLimited, recordFailedAttempt, clearAttempts } from "@/lib/auth/rate-limit";

function clientKey(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);

  if (isRateLimited(key)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  const passcode = typeof body?.passcode === "string" ? body.passcode : "";

  if (!passcode || !(await verifyPasscode(passcode))) {
    recordFailedAttempt(key);
    return NextResponse.json({ error: "Incorrect passcode." }, { status: 401 });
  }

  clearAttempts(key);
  await setSessionCookie();
  return NextResponse.json({ ok: true });
}

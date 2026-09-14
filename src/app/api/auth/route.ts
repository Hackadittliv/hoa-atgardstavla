import { NextResponse } from "next/server";
import {
  clearSessionCookie,
  hasValidSession,
  pinMatches,
  setSessionCookie,
} from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ ok: await hasValidSession() });
}

export async function POST(request: Request) {
  let body: { pin?: unknown } = {};
  try {
    body = (await request.json()) as { pin?: unknown };
  } catch {
    return NextResponse.json({ error: "Ogiltig begäran" }, { status: 400 });
  }

  if (typeof body.pin !== "string" || !pinMatches(body.pin)) {
    return NextResponse.json({ error: "Fel pinkod" }, { status: 401 });
  }

  await setSessionCookie();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}

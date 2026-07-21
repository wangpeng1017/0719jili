import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "jili_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret() {
  return process.env.SESSION_SECRET || "fallback-dev-secret";
}

function sign(data: string): string {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
}

export type SessionData = {
  userId: string;
  username: string;
  name: string;
  role: string;
  expiresAt: number;
};

export async function createSession(res: NextResponse, data: Omit<SessionData, "expiresAt">) {
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload: SessionData = { ...data, expiresAt };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${encoded}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const dotIndex = raw.lastIndexOf(".");
  if (dotIndex === -1) return null;
  const encoded = raw.slice(0, dotIndex);
  const signature = raw.slice(dotIndex + 1);
  if (sign(encoded) !== signature) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionData;
    if (payload.expiresAt < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function middlewareAuth(req: NextRequest): NextResponse | null {
  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return NextResponse.redirect(new URL("/login", req.url));
  const dotIndex = raw.lastIndexOf(".");
  if (dotIndex === -1) return NextResponse.redirect(new URL("/login", req.url));
  const encoded = raw.slice(0, dotIndex);
  const signature = raw.slice(dotIndex + 1);
  if (sign(encoded) !== signature) return NextResponse.redirect(new URL("/login", req.url));
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as SessionData;
    if (payload.expiresAt < Date.now()) return NextResponse.redirect(new URL("/login", req.url));
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return null;
}

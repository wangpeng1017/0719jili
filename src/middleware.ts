import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "jili_session";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip basePath prefix for route matching
  const path = BASE_PATH && pathname.startsWith(BASE_PATH) ? pathname.slice(BASE_PATH.length) || "/" : pathname;

  // Public paths
  if (path.startsWith("/login") || path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Static files and Next.js internals
  if (path.startsWith("/_next") || path.startsWith("/favicon") || path.includes(".")) {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    return NextResponse.redirect(new URL(`${BASE_PATH}/login`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

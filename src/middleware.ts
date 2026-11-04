import { NextResponse, type NextRequest } from "next/server";
import { decodeSessionEdge } from "./lib/security/session-edge";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "nitro_auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // 1. Strict Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
  );

  // 2. Allow static files, api webhooks, next internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/webhook") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return response;
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = token ? decodeSessionEdge(token) : null;

  // 3. Unauthenticated access
  if (!session) {
    if (pathname.startsWith("/auth")) {
      return response;
    }
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Authenticated user visiting /auth/login or /
  if (pathname === "/" || pathname === "/auth/login") {
    if (!session.isMfaVerified) {
      return NextResponse.redirect(new URL("/auth/mfa-challenge", request.url));
    }
    if (session.forcePasswordChange) {
      return NextResponse.redirect(new URL("/auth/change-password", request.url));
    }
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }

  // 5. MFA Challenge checkpoint
  if (!session.isMfaVerified && pathname !== "/auth/mfa-challenge" && pathname !== "/auth/logout") {
    return NextResponse.redirect(new URL("/auth/mfa-challenge", request.url));
  }

  // 6. Force password change checkpoint
  if (
    session.forcePasswordChange &&
    pathname !== "/auth/change-password" &&
    pathname !== "/auth/logout"
  ) {
    return NextResponse.redirect(new URL("/auth/change-password", request.url));
  }

  // 7. Role-Gated Access Control (Never trust client)
  if (pathname.startsWith("/student") && session.role !== "student") {
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }
  if (pathname.startsWith("/faculty") && session.role !== "faculty") {
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }
  if (pathname.startsWith("/admin") && session.role !== "admin") {
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }
  if (pathname.startsWith("/parent") && session.role !== "parent") {
    return NextResponse.redirect(new URL(`/${session.role}/dashboard`, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

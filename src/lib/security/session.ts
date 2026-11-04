import crypto from "crypto";
import { cookies } from "next/headers";
import { SessionPayload } from "../types";
import { env } from "../env";

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "nitro_auth_token";
const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours
const REAUTH_WINDOW_MS = 5 * 60 * 1000; // 5 minutes freshness for sensitive actions

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function encodeSession(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  const b64 = Buffer.from(json).toString("base64url");
  const signature = sign(b64, env.sessionSecret);
  return `${b64}.${signature}`;
}

export function decodeSession(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [b64, expectedSig] = parts;
    const actualSig = sign(b64, env.sessionSecret);

    if (!crypto.timingSafeEqual(Buffer.from(actualSig), Buffer.from(expectedSig))) {
      return null;
    }

    const json = Buffer.from(b64, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as SessionPayload;
    const now = Date.now();

    // Enforce Absolute Timeout
    if (now - payload.createdAt > ABSOLUTE_TIMEOUT_MS) {
      return null;
    }

    // Enforce Idle Timeout
    if (now - payload.lastActiveAt > IDLE_TIMEOUT_MS) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = decodeSession(token);
  if (!session) return null;

  // Touch session activity timestamp
  const now = Date.now();
  if (now - session.lastActiveAt > 60 * 1000) {
    session.lastActiveAt = now;
    const updatedToken = encodeSession(session);
    try {
      cookieStore.set(COOKIE_NAME, updatedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
      });
    } catch {
      // Ignore if headers already sent in edge handler
    }
  }

  return session;
}

export async function setSession(payload: SessionPayload) {
  const token = encodeSession(payload);
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(ABSOLUTE_TIMEOUT_MS / 1000),
  });
}

export async function clearSession() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function isReauthValid(session: SessionPayload): boolean {
  const now = Date.now();
  return now - (session.lastReauthAt || 0) < REAUTH_WINDOW_MS;
}

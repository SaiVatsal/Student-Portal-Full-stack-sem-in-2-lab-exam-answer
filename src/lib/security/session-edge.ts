import { SessionPayload } from "../types";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const ABSOLUTE_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

export function decodeSessionEdge(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [b64] = parts;
    const binary = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(binary) as SessionPayload;
    const now = Date.now();

    if (now - payload.createdAt > ABSOLUTE_TIMEOUT_MS) {
      return null;
    }

    if (now - payload.lastActiveAt > IDLE_TIMEOUT_MS) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

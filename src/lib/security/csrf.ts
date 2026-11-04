import { headers } from "next/headers";

export function verifyRequestOrigin(): boolean {
  const headerList = headers();
  const origin = headerList.get("origin");
  const host = headerList.get("host");

  if (!origin) {
    // Standard direct Next.js server actions or same-origin requests
    return true;
  }

  try {
    const originUrl = new URL(origin);
    if (host && originUrl.host === host) {
      return true;
    }
    // Allow localhost during dev
    if (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1") {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

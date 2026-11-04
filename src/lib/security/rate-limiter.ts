interface RateLimitEntry {
  count: number;
  resetAt: number;
  lockedUntil?: number;
}

const ipBuckets = new Map<string, RateLimitEntry>();
const accountBuckets = new Map<string, RateLimitEntry>();

export interface RateLimitCheckResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  message?: string;
}

export class SecurityRateLimiter {
  private static MAX_ATTEMPTS = 5;
  private static WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
  private static LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes lockout

  public static checkAndIncrement(
    ip: string,
    accountIdentifier?: string
  ): RateLimitCheckResult {
    const now = Date.now();

    // 1. Check IP bucket
    const ipResult = this.evaluateBucket(ipBuckets, ip, now);
    if (!ipResult.allowed) {
      return ipResult;
    }

    // 2. Check Account bucket if provided
    if (accountIdentifier) {
      const cleanAccount = accountIdentifier.trim().toLowerCase();
      const accountResult = this.evaluateBucket(accountBuckets, cleanAccount, now);
      if (!accountResult.allowed) {
        return accountResult;
      }
    }

    return { allowed: true };
  }

  public static recordFailure(ip: string, accountIdentifier?: string) {
    const now = Date.now();
    this.incrementBucket(ipBuckets, ip, now);
    if (accountIdentifier) {
      this.incrementBucket(accountBuckets, accountIdentifier.trim().toLowerCase(), now);
    }
  }

  public static resetSuccess(ip: string, accountIdentifier?: string) {
    ipBuckets.delete(ip);
    if (accountIdentifier) {
      accountBuckets.delete(accountIdentifier.trim().toLowerCase());
    }
  }

  private static evaluateBucket(
    store: Map<string, RateLimitEntry>,
    key: string,
    now: number
  ): RateLimitCheckResult {
    const entry = store.get(key);
    if (!entry) return { allowed: true };

    if (entry.lockedUntil && now < entry.lockedUntil) {
      const remainingSec = Math.ceil((entry.lockedUntil - now) / 1000);
      return {
        allowed: false,
        retryAfterSeconds: remainingSec,
        message: "Too many authentication attempts. For security reasons, please try again in a few minutes.",
      };
    }

    // Window expired
    if (now > entry.resetAt) {
      store.delete(key);
      return { allowed: true };
    }

    return { allowed: true };
  }

  private static incrementBucket(
    store: Map<string, RateLimitEntry>,
    key: string,
    now: number
  ) {
    const entry = store.get(key);
    if (!entry || now > entry.resetAt) {
      store.set(key, {
        count: 1,
        resetAt: now + this.WINDOW_MS,
      });
      return;
    }

    entry.count += 1;
    if (entry.count >= this.MAX_ATTEMPTS) {
      entry.lockedUntil = now + this.LOCKOUT_MS;
    }
  }
}

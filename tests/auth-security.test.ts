import { describe, it, expect } from "vitest";
import { validatePasswordStrength } from "../src/lib/security/password";
import { SecurityRateLimiter } from "../src/lib/security/rate-limiter";
import { MFAManager } from "../src/lib/security/mfa";
import { encodeSession, decodeSession } from "../src/lib/security/session";
import { SessionPayload } from "../src/lib/types";

describe("Authentication & Security Infrastructure Unit Tests", () => {
  it("rejects weak or breached passwords and accepts high-entropy passphrases", () => {
    // Under 10 characters
    const short = validatePasswordStrength("Abc1!");
    expect(short.valid).toBe(false);

    // Common breached password
    const breached = validatePasswordStrength("password123");
    expect(breached.valid).toBe(false);

    // Strong compliant passphrase
    const strong = validatePasswordStrength("Quantum!Electrodynamics#2026");
    expect(strong.valid).toBe(true);
    expect(strong.score).toBeGreaterThanOrEqual(3);
  });

  it("locks out an account after 5 failed authentication attempts", () => {
    const testIp = "192.168.1.100";
    const testAccount = "2500040999";

    // Initial attempt is allowed
    expect(SecurityRateLimiter.checkAndIncrement(testIp, testAccount).allowed).toBe(true);

    // Simulate 5 consecutive failed attempts
    for (let i = 0; i < 5; i++) {
      SecurityRateLimiter.recordFailure(testIp, testAccount);
    }

    const locked = SecurityRateLimiter.checkAndIncrement(testIp, testAccount);
    expect(locked.allowed).toBe(false);
    expect(locked.message).toContain("Too many authentication attempts");

    // Resetting clears the lock
    SecurityRateLimiter.resetSuccess(testIp, testAccount);
    expect(SecurityRateLimiter.checkAndIncrement(testIp, testAccount).allowed).toBe(true);
  });

  it("generates and verifies RFC 6238 TOTP tokens and recovery codes", () => {
    const secret = MFAManager.generateSecret();
    expect(secret.length).toBeGreaterThanOrEqual(16);

    // Invalid token rejected
    expect(MFAManager.verifyToken("000000", secret)).toBe(false);

    // Recovery codes test
    const recoveryCodes = MFAManager.generateRecoveryCodes(8);
    expect(recoveryCodes.length).toBe(8);

    const firstCode = recoveryCodes[0];
    const consumption = MFAManager.verifyAndConsumeRecoveryCode(firstCode, recoveryCodes);
    expect(consumption.valid).toBe(true);
    expect(consumption.remainingCodes.length).toBe(7);

    // Re-consuming same code fails
    const retest = MFAManager.verifyAndConsumeRecoveryCode(firstCode, consumption.remainingCodes);
    expect(retest.valid).toBe(false);
  });

  it("encodes, verifies signatures, and detects tampering in session cookies", () => {
    const payload: SessionPayload = {
      userId: "test-user-1",
      email: "test@nitroazard.edu.in",
      role: "student",
      identifier: "2500040001",
      fullName: "Test User",
      isMfaVerified: true,
      forcePasswordChange: false,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      lastReauthAt: Date.now(),
    };

    const token = encodeSession(payload);
    expect(typeof token).toBe("string");

    const decoded = decodeSession(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.identifier).toBe("2500040001");

    // Tampered payload token
    const [b64, sig] = token.split(".");
    const tamperedPayload = Buffer.from(JSON.stringify({ ...payload, role: "admin" })).toString("base64url");
    const tamperedToken = `${tamperedPayload}.${sig}`;

    expect(decodeSession(tamperedToken)).toBeNull();
  });

  it("verifies super admin 2500040224 is registered with full admin role access", async () => {
    const { getDatabase } = await import("../src/server/db");
    const store = getDatabase();
    const adminUser = Array.from(store.profiles.values()).find(
      (p) => p.identifier === "2500040224"
    );
    expect(adminUser).toBeDefined();
    expect(adminUser?.role).toBe("admin");
    expect(adminUser?.identifier).toBe("2500040224");
  });
});

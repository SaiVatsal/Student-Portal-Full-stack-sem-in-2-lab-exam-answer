import { authenticator } from "otplib";
import QRCode from "qrcode";
import crypto from "crypto";

authenticator.options = {
  window: 1, // Allow 1 step before/after for time drift
  step: 30,
};

export class MFAManager {
  private static APP_NAME = "Nitro Azard ERP";

  public static generateSecret(): string {
    return authenticator.generateSecret();
  }

  public static async generateQRCode(email: string, secret: string): Promise<string> {
    const otpAuthUrl = authenticator.keyuri(email, this.APP_NAME, secret);
    return await QRCode.toDataURL(otpAuthUrl, {
      margin: 1,
      width: 256,
      color: {
        dark: "#0B1220",
        light: "#FFFFFF",
      },
    });
  }

  public static verifyToken(token: string, secret: string): boolean {
    try {
      return authenticator.verify({
        token: token.trim(),
        secret,
      });
    } catch {
      return false;
    }
  }

  public static generateRecoveryCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  public static verifyAndConsumeRecoveryCode(
    enteredCode: string,
    existingCodes: string[]
  ): { valid: boolean; remainingCodes: string[] } {
    const normalized = enteredCode.trim().toUpperCase();
    const index = existingCodes.findIndex(
      (c) => c.toUpperCase() === normalized || c.replace("-", "").toUpperCase() === normalized.replace("-", "")
    );

    if (index === -1) {
      return { valid: false, remainingCodes: existingCodes };
    }

    const remaining = [...existingCodes];
    remaining.splice(index, 1);
    return { valid: true, remainingCodes: remaining };
  }
}

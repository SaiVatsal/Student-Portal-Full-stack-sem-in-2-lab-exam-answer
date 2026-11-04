import zxcvbn from "zxcvbn";

const COMMON_BREACHED_PASSWORDS = new Set([
  "password123",
  "admin12345",
  "university2024",
  "university2025",
  "welcome1234",
  "1234567890",
  "student1234",
  "faculty1234",
  "iloveyou123",
  "changeme123",
  "qwerty12345",
  "kluuniversity",
  "nitroazard123",
]);

export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  message?: string;
  feedback?: string[];
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  if (!password || password.length < 10) {
    return {
      valid: false,
      score: 0,
      message: "Password must be at least 10 characters in length.",
    };
  }

  const normalized = password.trim().toLowerCase();
  if (COMMON_BREACHED_PASSWORDS.has(normalized)) {
    return {
      valid: false,
      score: 0,
      message: "This password appears in known leaked credentials lists. Choose a unique passphrase.",
    };
  }

  const result = zxcvbn(password);

  if (result.score < 3) {
    const suggestions = result.feedback.suggestions.length > 0
      ? result.feedback.suggestions
      : ["Use a combination of upper and lower case letters, numbers, and symbols."];

    return {
      valid: false,
      score: result.score,
      message: result.feedback.warning || "Password is too weak. Please add entropy.",
      feedback: suggestions,
    };
  }

  return {
    valid: true,
    score: result.score,
  };
}

import crypto from "crypto";

export const OTP_LENGTH = 6;
export const OTP_VALIDITY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

export function generateOtp(): string {
  return crypto
    .randomInt(0, 1_000_000)
    .toString()
    .padStart(OTP_LENGTH, "0");
}

export function hashOtp(otp: string): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export function otpExpiresAt(): Date {
  return new Date(
    Date.now() + OTP_VALIDITY_MINUTES * 60 * 1000
  );
}

export function verifyOtpHash(
  otp: string,
  expectedHash: string
): boolean {
  const actualHash = hashOtp(otp);

  return crypto.timingSafeEqual(
    Buffer.from(actualHash, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

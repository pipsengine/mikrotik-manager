export const passwordPolicy = {
  minLength: 14,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSymbol: true,
  expiryDays: 90,
  lockoutThreshold: 5,
  lockoutMinutes: 30
} as const;

export const secureCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/"
} as const;

export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'"
].join("; ");

export function assertApprovedForExecution(status: string) {
  if (status !== "Approved") {
    throw new Error("Router changes cannot execute before approval.");
  }
}

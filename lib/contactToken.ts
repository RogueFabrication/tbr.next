import crypto from "crypto";

// Contact token payload matches what we pass from the contact form.
export type ContactTokenPayload = {
  name: string;
  email: string;
  subject: string;
  messageType: string;
  message: string;
  createdAt: number;
};

// Secret for signing tokens – set this in Vercel:
// CONTACT_TOKEN_SECRET=some-long-random-string
const SECRET =
  process.env.CONTACT_TOKEN_SECRET ||
  process.env.CONTACT_FORM_SECRET ||
  "dev-contact-secret-do-not-use-in-prod";

// How long a verify link is valid (ms)
const TOKEN_TTL_MS = 1000 * 60 * 60 * 48; // 48 hours

export function createContactToken(payload: ContactTokenPayload): string {
  const json = JSON.stringify(payload);
  const data = Buffer.from(json, "utf8").toString("base64url");
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url");

  return `${data}.${sig}`;
}

export function verifyContactToken(token: string): ContactTokenPayload | null {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [data, sig] = parts;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(data)
      .digest("base64url");

    // Use timing-safe comparison to avoid leaks
    const sigBuf = Buffer.from(sig, "utf8");
    const expBuf = Buffer.from(expected, "utf8");
    if (
      sigBuf.length !== expBuf.length ||
      !crypto.timingSafeEqual(sigBuf, expBuf)
    ) {
      return null;
    }

    const json = Buffer.from(data, "base64url").toString("utf8");
    const payload = JSON.parse(json) as ContactTokenPayload;

    if (typeof payload.createdAt !== "number") return null;
    if (Date.now() - payload.createdAt > TOKEN_TTL_MS) {
      return null;
    }

    return payload;
  } catch (err) {
    console.error("[contactToken] Failed to verify token:", err);
    return null;
  }
}

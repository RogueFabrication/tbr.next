import crypto from "crypto";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  messageType: string;
  message: string;
  createdAt: number;
};

function getContactSecret(): string {
  const secret = process.env.CONTACT_SIGNING_SECRET;
  if (!secret) {
    throw new Error(
      "CONTACT_SIGNING_SECRET environment variable is required for contact form verification."
    );
  }
  return secret;
}

/**
 * Base64url encode (URL-safe base64)
 */
function base64urlEncode(buffer: Buffer): string {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Base64url decode
 */
function base64urlDecode(str: string): Buffer {
  // Add padding if needed
  let padded = str.replace(/-/g, "+").replace(/_/g, "/");
  while (padded.length % 4) {
    padded += "=";
  }
  return Buffer.from(padded, "base64");
}

export function createContactToken(payload: ContactPayload): string {
  const secret = getContactSecret();

  // Serialize payload as JSON
  const jsonPayload = JSON.stringify(payload);

  // Base64url-encode the JSON string
  const base64Payload = base64urlEncode(Buffer.from(jsonPayload, "utf8"));

  // Compute HMAC-SHA256 of the base64 segment
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(base64Payload);
  const signature = hmac.digest();

  // Base64url-encode the signature
  const base64Signature = base64urlEncode(signature);

  // Return token as payload.signature
  return `${base64Payload}.${base64Signature}`;
}

export function verifyContactToken(
  token: string,
  maxAgeMs = 7 * 24 * 60 * 60 * 1000
): ContactPayload | null {
  try {
    const secret = getContactSecret();

    // Split on '.' into [payloadPart, signaturePart]
    const parts = token.split(".");
    if (parts.length !== 2) {
      return null;
    }

    const [base64Payload, base64Signature] = parts;

    // Recompute signature from payloadPart using the secret
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(base64Payload);
    const expectedSignature = hmac.digest();
    const expectedBase64Signature = base64urlEncode(expectedSignature);

    // Decode the provided signature
    const providedSignature = base64urlDecode(base64Signature);

    // Use timing-safe comparison
    if (!crypto.timingSafeEqual(expectedSignature, providedSignature)) {
      return null;
    }

    // Decode payload JSON
    const payloadBuffer = base64urlDecode(base64Payload);
    const jsonPayload = payloadBuffer.toString("utf8");
    const payload: ContactPayload = JSON.parse(jsonPayload);

    // Check age
    const now = Date.now();
    if (now - payload.createdAt > maxAgeMs) {
      return null;
    }

    return payload;
  } catch {
    // Never throw on malformed tokens; just return null
    return null;
  }
}


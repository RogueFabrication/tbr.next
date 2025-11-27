import { NextRequest, NextResponse } from "next/server";
import { verifyContactToken } from "../../../../lib/contactToken";
import { sendContactForwardEmail } from "../../../../lib/email";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing token" },
        { status: 400 }
      );
    }

    const payload = verifyContactToken(token);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Forward the verified message to the admin inbox
    await sendContactForwardEmail(payload);

    const redirectTarget =
      process.env.NEXT_PUBLIC_CONTACT_THANKYOU_URL ||
      "/about?sent=1";

    return NextResponse.redirect(redirectTarget);
  } catch (err) {
    console.error("[contact-verify] Error verifying contact token:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

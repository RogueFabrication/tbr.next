import nodemailer from "nodemailer";

type ContactVerificationEmailParams = {
  to: string;
  name: string;
  subject: string;
  messageType: string;
  message: string;
  verifyUrl: string;
};

/**
 * Build a reusable Nodemailer transporter using env-configured SMTP settings.
 * Throws if required env vars are missing.
 */
function createTransporter() {
  const host = process.env.TBR_SMTP_HOST;
  const portRaw = process.env.TBR_SMTP_PORT || "465";
  const user = process.env.TBR_SMTP_USER;
  const pass = process.env.TBR_SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      "Missing SMTP configuration. Ensure TBR_SMTP_HOST, TBR_SMTP_USER, and TBR_SMTP_PASS are set."
    );
  }

  const port = Number.parseInt(portRaw, 10);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for Gmail SSL; falls back if you change port
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send the initial contact verification email to the user.
 * The message includes their original content and a verification link.
 */
export async function sendContactVerificationEmail(
  params: ContactVerificationEmailParams
) {
  const { to, name, subject, messageType, message, verifyUrl } = params;

  const transporter = createTransporter();

  const from =
    process.env.TBR_SMTP_FROM ||
    "TubeBenderReviews <no-reply@tubebenderreviews.com>";

  const replyTo = process.env.TBR_SMTP_REPLY_TO || undefined;

  const safeName = (name || "").trim() || "there";

  const mailSubject = `[TubeBenderReviews] Confirm your message: ${subject}`;

  const textBody = [
    `Hi ${safeName},`,
    "",
    "We received a contact request on TubeBenderReviews.com with the details below.",
    "",
    `Type: ${messageType}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    "To confirm you're a real person and actually send this message to our team, please click the link below:",
    verifyUrl,
    "",
    "If you did not submit this request, you can safely ignore this email.",
    "",
    "- TubeBenderReviews",
  ].join("\n");

  const htmlBody = `
    <p>Hi ${safeName},</p>
    <p>We received a contact request on <strong>TubeBenderReviews.com</strong> with the details below.</p>
    <p>
      <strong>Type:</strong> ${messageType}<br />
      <strong>Subject:</strong> ${subject}
    </p>
    <p>
      <strong>Message:</strong><br />
      <pre style="white-space: pre-wrap; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
${message.replace(/</g, "&lt;")}
      </pre>
    </p>
    <p>
      To confirm you're a real person and actually send this message to our team, please click the button below:
    </p>
    <p>
      <a href="${verifyUrl}"
         style="display:inline-block;padding:10px 16px;border-radius:4px;background-color:#111827;color:#ffffff;text-decoration:none;font-weight:600;">
        Confirm &amp; Send Message
      </a>
    </p>
    <p>If you did not submit this request, you can safely ignore this email.</p>
    <p>- TubeBenderReviews</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject: mailSubject,
      replyTo,
      text: textBody,
      html: htmlBody,
    });
  } catch (err) {
    console.error("[email-smtp] Failed to send contact verification email:", err);
    // Re-throw so the API route can surface a 500 to the client.
    throw err;
  }
}


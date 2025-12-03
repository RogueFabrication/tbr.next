import nodemailer from "nodemailer";

type ContactVerificationPayload = {
  to: string;
  name: string;
  subject: string;
  messageType: string;
  message: string;
  verifyUrl: string;
};

type ForwardPayload = {
  name: string;
  email: string;
  subject: string;
  messageType: string;
  message: string;
  createdAt: number;
};

const {
  TBR_SMTP_HOST,
  TBR_SMTP_PORT,
  TBR_SMTP_USER,
  TBR_SMTP_PASS,
  TBR_CONTACT_FROM,
  TBR_CONTACT_TO,
} = process.env;

if (!TBR_SMTP_HOST || !TBR_SMTP_USER || !TBR_SMTP_PASS) {
  // Fail fast at module load on the server – better than mysterious runtime failures
  console.warn(
    "[email-smtp] Missing SMTP configuration. Ensure TBR_SMTP_HOST, TBR_SMTP_USER, and TBR_SMTP_PASS are set."
  );
}

function getTransport() {
  if (!TBR_SMTP_HOST || !TBR_SMTP_USER || !TBR_SMTP_PASS) {
    throw new Error(
      "Missing SMTP configuration. Ensure TBR_SMTP_HOST, TBR_SMTP_USER, and TBR_SMTP_PASS are set."
    );
  }

  const port = Number(TBR_SMTP_PORT || 587);

  const transporter = nodemailer.createTransport({
    host: TBR_SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: TBR_SMTP_USER,
      pass: TBR_SMTP_PASS,
    },
  });

  return transporter;
}

const DEFAULT_FROM =
  TBR_CONTACT_FROM || 'TubeBenderReviews <tbradmin@tubebenderreviews.com>';
const DEFAULT_TO =
  TBR_CONTACT_TO || "tbradmin@tubebenderreviews.com";

export async function sendContactVerificationEmail(
  payload: ContactVerificationPayload
) {
  const transporter = getTransport();

  const subject = "Please confirm your TubeBenderReviews message";

  const text = [
    `Hi ${payload.name || "there"},`,
    "",
    "We received a contact request on TubeBenderReviews using your e-mail address.",
    "",
    `Subject: ${payload.subject || "(no subject)"}`,
    `Topic: ${payload.messageType || "General"}`,
    "",
    "To confirm that this message is really from you and not an automated bot, please click the link below:",
    "",
    payload.verifyUrl,
    "",
    "After you click the link, your message will be forwarded to the review team at RogueFab / TubeBenderReviews.",
    "",
    "If you did not try to contact us, you can safely ignore this e-mail.",
    "",
    "— TubeBenderReviews",
  ].join("\n");

  const html = text
    .split("\n")
    .map((line) =>
      line === payload.verifyUrl
        ? `<p><a href="${payload.verifyUrl}">${payload.verifyUrl}</a></p>`
        : `<p>${line || "&nbsp;"}</p>`
    )
    .join("\n");

  await transporter.sendMail({
    from: DEFAULT_FROM,
    to: payload.to,
    subject,
    text,
    html,
  });
}

export async function sendContactForwardEmail(payload: ForwardPayload) {
  const transporter = getTransport();

  const subject = `[TubeBenderReviews] New contact from ${payload.name} – ${payload.subject}`;

  const created = new Date(payload.createdAt || Date.now());
  const createdIso = created.toISOString();

  const text = [
    "New contact form submission from TubeBenderReviews:",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Topic: ${payload.messageType}`,
    `Submitted at: ${createdIso}`,
    "",
    "Message:",
    payload.message,
    "",
    "You can reply directly to this e-mail to respond to the user.",
  ].join("\n");

  const html = [
    "<p>New contact form submission from <strong>TubeBenderReviews</strong>:</p>",
    "<ul>",
    `<li><strong>Name:</strong> ${payload.name}</li>`,
    `<li><strong>Email:</strong> ${payload.email}</li>`,
    `<li><strong>Topic:</strong> ${payload.messageType}</li>`,
    `<li><strong>Submitted at:</strong> ${createdIso}</li>`,
    "</ul>",
    "<p><strong>Message:</strong></p>",
    `<p>${payload.message.replace(/\n/g, "<br />")}</p>`,
    "<p>You can reply directly to this e-mail to respond to the user.</p>",
  ].join("\n");

  await transporter.sendMail({
    from: DEFAULT_FROM,
    to: DEFAULT_TO,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
}

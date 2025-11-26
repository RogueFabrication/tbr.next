/**
 * Email utilities for contact form.
 * Requires nodemailer to be installed.
 */

import nodemailer from "nodemailer";

export function getContactToAddress(): string {
  return process.env.CONTACT_TO || "tbradmin@tubebenderreviews.com";
}

export function getContactFromAddress(): string {
  return process.env.CONTACT_FROM || "no-reply@tubebenderreviews.com";
}

export function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    throw new Error(
      "SMTP not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS environment variables."
    );
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendContactVerificationEmail(args: {
  to: string;
  name: string;
  subject: string;
  messageType: string;
  message: string;
  verifyUrl: string;
}): Promise<void> {
  const transporter = createTransport();
  const from = getContactFromAddress();

  const subject = "Confirm your message to TubeBenderReviews";
  const plainText = `We received a contact request from this email address.

To verify and send your message to a reviewer, please click this link:
${args.verifyUrl}

If you didn't submit a contact form on TubeBenderReviews, you can safely ignore this email.

Your message:
---
Subject: ${args.subject}
Type: ${args.messageType}

${args.message}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirm your message</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>We received a contact request from this email address.</p>
  
  <p>To verify and send your message to a reviewer, please click this link:</p>
  <p><a href="${args.verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #1f2937; color: white; text-decoration: none; border-radius: 4px;">Verify and Send Message</a></p>
  
  <p>If you didn't submit a contact form on TubeBenderReviews, you can safely ignore this email.</p>
  
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
  
  <p><strong>Your message:</strong></p>
  <p><strong>Subject:</strong> ${args.subject}</p>
  <p><strong>Type:</strong> ${args.messageType}</p>
  <pre style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${args.message}</pre>
</body>
</html>
`;

  await transporter.sendMail({
    from,
    to: args.to,
    subject,
    text: plainText,
    html,
  });
}

export async function sendContactToAdmin(args: {
  name: string;
  email: string;
  subject: string;
  messageType: string;
  message: string;
  createdAt: number;
}): Promise<void> {
  const transporter = createTransport();
  const from = getContactFromAddress();
  const to = getContactToAddress();

  const subject = `[TBR Contact] ${args.messageType} – ${args.subject || "New message"}`;
  const timestamp = new Date(args.createdAt).toISOString();

  const plainText = `New contact form submission:

Name: ${args.name}
Email: ${args.email}
Message Type: ${args.messageType}
Subject: ${args.subject}
Submitted: ${timestamp}

Message:
${args.message}
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <h2>New contact form submission</h2>
  
  <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${args.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${args.email}">${args.email}</a></td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Message Type:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${args.messageType}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${args.subject}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${timestamp}</td>
    </tr>
  </table>
  
  <h3 style="margin-top: 20px;">Message:</h3>
  <pre style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${args.message}</pre>
</body>
</html>
`;

  await transporter.sendMail({
    from,
    to,
    replyTo: args.email,
    subject,
    text: plainText,
    html,
  });
}


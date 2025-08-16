import type { Options as SMTPTransportOptions } from 'nodemailer/lib/smtp-transport';

export async function sendMail(args: { to: string[]; subject: string; body: string }) {
  const { to, subject, body } = args;

  // Try Resend first
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM || 'Meeting Summarizer <onboarding@resend.dev>';
    const result = await resend.emails.send({ from, to, subject, text: body });
    if (result.error) throw new Error(result.error.message || 'Resend failed');
    return;
  }

  // Fallback to SMTP via Nodemailer
  const nodemailer = await import('nodemailer');
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || 'Meeting Summarizer <no-reply@example.com>';

  if (!host || !user || !pass) throw new Error('SMTP is not configured and no Resend API key provided');

  const transportOptions: SMTPTransportOptions = {
    host, port, secure, auth: { user, pass }
  };
  const transporter = nodemailer.createTransport(transportOptions);
  await transporter.sendMail({ from, to, subject, text: body });
}

// src/lib/resend.ts
import * as React from "react";
import { Resend } from "resend";

/**
 * Lazily create and cache a single Resend client.
 */
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is missing. Add it in .env.local");
    }
    _resend = new Resend(key);
  }
  return _resend;
}

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  replyTo?: string | string[];
  from?: string;
};

/** Minimal HTML → text fallback */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/(h[1-6]|li|div|section|article|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Tiny React wrapper that can render your HTML or fallback text */
function BasicEmail({ html, text }: { html?: string; text?: string }) {
  const safeText = !html && text ? text : undefined;

  // If you provided HTML, render it; otherwise render plain text.
  if (html) {
    // Using dangerouslySetInnerHTML is fine here because *you* control the HTML.
    return React.createElement("div", {
      dangerouslySetInnerHTML: { __html: html },
    });
  }
  return React.createElement("pre", null, safeText ?? "");
}

/**
 * Send an email via Resend, always including a `react` element
 * to satisfy versions where `react` is required by the types.
 */
export async function sendEmail(opts: SendEmailOptions) {
  const resend = getResend();

  const {
    to,
    subject,
    html,
    text,
    replyTo,
    from = process.env.EMAIL_FROM || "onboarding@resend.dev",
  } = opts;

  if (!to || !subject) {
    throw new Error("sendEmail: 'to' and 'subject' are required");
  }
  if (!html && !text) {
    throw new Error("sendEmail: provide at least 'html' or 'text'");
  }

  const textFinal = text ?? (html ? htmlToText(html) : undefined);

  const payload = {
    from,
    to,
    subject,
    // ✅ Provide a React element to satisfy typings that require `react`
    react: React.createElement(BasicEmail, { html, text: textFinal }),
    // It’s okay to also include html/text in case your account/features use them:
    html,
    text: textFinal,
    replyTo, // correct camelCase key
  } as const;

  const res = await resend.emails.send(payload);
  if (res.error) {
    // Logs the full error server-side for debugging
    console.error("[Resend] send error:", res.error);
    throw new Error(res.error.message || "Resend failed to send email");
  }
  return res;
}

/** Convenience helper */
export async function sendSimpleEmail(
  to: string | string[],
  subject: string,
  message: string,
  { from, replyTo }: { from?: string; replyTo?: string | string[] } = {}
) {
  return sendEmail({ to, subject, text: message, from, replyTo });
}

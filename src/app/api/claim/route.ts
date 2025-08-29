import * as React from "react";
import { NextRequest } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

interface ClaimEmailProps {
  name: string;
  prevName?: string;
  email: string;
  phone: string;
  address: string;
  contactPref: string;
  notes?: string;
}

function ClaimEmail({
  name,
  prevName,
  email,
  phone,
  address,
  contactPref,
  notes,
}: ClaimEmailProps) {
  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "New Claim Inquiry"),
    React.createElement("p", null, React.createElement("b", null, "Name: "), name),
    React.createElement("p", null, React.createElement("b", null, "Previous Name: "), prevName || "-"),
    React.createElement("p", null, React.createElement("b", null, "Email: "), email),
    React.createElement("p", null, React.createElement("b", null, "Phone: "), phone),
    React.createElement("p", null, React.createElement("b", null, "Mailing Address: "), address),
    React.createElement("p", null, React.createElement("b", null, "Contact Preference: "), contactPref),
    React.createElement("p", null, React.createElement("b", null, "Notes / Claim Details: "), notes || "-"),
  );
}

// Infer the exact return type from the SDK:
type ResendSendResponse = Awaited<ReturnType<Resend["emails"]["send"]>>;

export async function POST(req: NextRequest) {
  try {
    const body: Partial<ClaimEmailProps> = await req.json();
    const { name, prevName, email, phone, address, contactPref, notes } = body || {};

    if (!name || !email || !phone || !address || !contactPref) {
      return Response.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json({ ok: false, error: "RESEND_API_KEY missing" }, { status: 500 });
    }

    const resend = new Resend(apiKey);

    const response: ResendSendResponse = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: "hashmiumer672@gmail.com",
      subject: "New Claim Inquiry",
      react: React.createElement(ClaimEmail, {
        name,
        prevName,
        email,
        phone,
        address,
        contactPref,
        notes,
      }),
      text: [
        `Name: ${name}`,
        `Previous Name: ${prevName || "-"}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Address: ${address}`,
        `Contact Preference: ${contactPref}`,
        `Notes: ${notes || "-"}`,
      ].join("\n"),
      replyTo: email,
    });

    if (response.error) {
      console.error("[claim] Resend error:", response.error);
      return Response.json(
        { ok: false, error: response.error.message || "Resend failed" },
        { status: 500 }
      );
    }

    return Response.json({ ok: true, id: response.data?.id ?? null });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : typeof e === "string" ? e : "Unknown error";
    console.error("[claim] exception:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

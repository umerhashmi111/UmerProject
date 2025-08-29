"use client";

import { useState } from "react";

type FormState = { ok?: boolean; error?: string };

// Optional: helper to read a safe message from unknown errors
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "Something went wrong while sending your claim.";
  }
}

export default function ClaimForm() {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setPending(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Build a typed payload instead of relying on any from Object.fromEntries
    const payload = {
      name: String(fd.get("name") ?? ""),
      prevName: String(fd.get("prevName") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      contactPref: String(fd.get("contactPref") ?? ""), // "Email" | "Phone"
      notes: String(fd.get("notes") ?? ""),
      consent: fd.get("consent") ? "on" : "", // checkbox
    };

    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: FormState = await res.json();
      if (!data.ok) throw new Error(data.error || "Send failed");

      setDone(true);
      form.reset();
    } catch (error: unknown) {
      setErr(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="mt-8 rounded-xl border bg-[#f6ffed] p-6 text-center">
        <h2 className="text-xl font-semibold text-green-700">
          THANK YOU FOR SUBMITTING CLAIM
        </h2>
        <p className="mt-2 text-gray-700">Our company will contact you shortly.</p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 rounded-md bg-[#F2B705] px-5 py-2.5 text-sm font-semibold text-gray-900 shadow hover:brightness-95 transition"
        >
          Want to submit another claim?
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-800">Name *</label>
        <input
          name="name"
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">Previous Name(s)</label>
        <input
          name="prevName"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">Email *</label>
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">Phone *</label>
        <input
          name="phone"
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800">Mailing Address *</label>
        <input
          name="address"
          required
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <fieldset className="mt-2">
        <legend className="text-sm font-semibold text-gray-800">Contact preference *</legend>
        <div className="mt-2 flex gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="contactPref" value="Email" required />
            <span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="contactPref" value="Phone" required />
            <span>Phone</span>
          </label>
        </div>
      </fieldset>

      <div>
        <label className="block text-sm font-semibold text-gray-800">Notes / Details</label>
        <input
          name="notes"
          className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2876A7]"
        />
      </div>

      <label className="flex items-start gap-3 text-xs text-gray-700">
        <input type="checkbox" name="consent" className="mt-1" required />
        <span>
          I agree to be contacted by Westpoint Capital & Recovery via call, email, and text. Message and data rates may
          apply.
        </span>
      </label>

      {err && (
        <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-[#1f3f5b] text-white py-2.5 font-semibold hover:opacity-95 transition disabled:opacity-60"
      >
        {pending ? "Submitting..." : "Submit"}
      </button>

      <div className="mt-8 grid gap-4 md:grid-cols-3 text-sm text-gray-700">
        <div>✉️ info@wpcalrecovery.com</div>
        <div>📞 (888) 000-4770</div>
        <div>🕒 6:00 AM – 6:00 PM Eastern Time</div>
      </div>
    </form>
  );
}

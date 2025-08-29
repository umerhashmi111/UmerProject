"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // simple client-side checks
  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const pwScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0..5
  }, [password]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!emailValid) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        // Nice success feedback
        window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ no any needed
        // small delay feels snappy
        setTimeout(() => {
          window.location.href = "/login";
        }, 300);
      } else {
        setError((data as { error?: string })?.error || "Signup failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="rounded" />
          <span className="text-lg font-semibold text-gray-800">Westpoint Capital & Recovery</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-white/80 backdrop-blur shadow-md hover:shadow-lg transition-shadow">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#2876A7] hover:underline font-medium">
                Sign in
              </Link>
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-800">Email</label>
                <div
                  className={`mt-1 flex items-center rounded-lg border px-3 ${
                    email ? (emailValid ? "border-green-300" : "border-red-300") : "border-gray-300"
                  } focus-within:ring-2 focus-within:ring-[#2876A7]`}
                >
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 6l8 6 8-6M4 6v12h16V6" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-3 py-2 outline-none text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-800">Password</label>
                <div
                  className={`mt-1 flex items-center rounded-lg border px-3 ${
                    password.length ? (password.length >= 8 ? "border-green-300" : "border-red-300") : "border-gray-300"
                  } focus-within:ring-2 focus-within:ring-[#2876A7]`}
                >
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M6 10V8a6 6 0 1 1 12 0v2M6 10h12v10H6V10Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full bg-transparent px-3 py-2 outline-none text-sm"
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    className="ml-1 rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password strength */}
                <div className="mt-2">
                  <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        pwScore <= 1
                          ? "w-1/5 bg-red-400"
                          : pwScore === 2
                          ? "w-2/5 bg-orange-400"
                          : pwScore === 3
                          ? "w-3/5 bg-yellow-400"
                          : pwScore === 4
                          ? "w-4/5 bg-green-400"
                          : "w-full bg-green-500"
                      }`}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use 8+ chars with a mix of upper/lowercase, numbers, and symbols.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                disabled={busy}
                className="w-full rounded-lg bg-[#1f3f5b] text-white py-2.5 font-semibold shadow hover:opacity-95 transition disabled:opacity-60"
              >
                {busy ? "Creating..." : "Create account"}
              </button>

              {/* Fine print */}
              <p className="text-[11px] text-gray-500">
                By creating an account, you agree to our Terms and acknowledge our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

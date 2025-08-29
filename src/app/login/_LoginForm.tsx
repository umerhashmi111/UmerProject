// app/login/_LoginForm.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type LoginSuccess = { ok: true; hasTree: boolean };
type LoginError = { error: string };

function isJson(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("application/json");
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();       // ✅ Now inside Suspense (via parent)
  const nextUrl = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!emailValid) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter your password.");

    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let payload: LoginSuccess | LoginError = { error: "Unknown error" };
      if (isJson(res)) {
        payload = (await res.json()) as LoginSuccess | LoginError;
      } else {
        payload = { error: `Server returned ${res.status}` };
      }

      if (res.ok && "ok" in payload && payload.ok === true) {
        router.push(nextUrl || (payload.hasTree ? "/dashboard" : "/onboarding"));
      } else {
        setError(("error" in payload && payload.error) || "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
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
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-[#2876A7] hover:underline font-medium">
                Sign up
              </Link>
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                <div className="mt-1 flex items-center rounded-lg border border-gray-300 px-3 focus-within:ring-2 focus-within:ring-[#2876A7]">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M6 10V8a6 6 0 1 1 12 0v2M6 10h12v10H6V10Z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-3 py-2 outline-none text-sm"
                    required
                    autoComplete="current-password"
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
                <div className="mt-2 text-right">
                  <Link href="/forgot-password" className="text-xs text-gray-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-lg bg-[#1f3f5b] text-white py-2.5 font-semibold shadow hover:opacity-95 transition disabled:opacity-60"
              >
                {busy ? "Logging in..." : "Sign in"}
              </button>

              <p className="text-[11px] text-gray-500">
                By signing in, you agree to our Terms and acknowledge our Privacy Policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

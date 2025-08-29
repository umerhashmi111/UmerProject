// app/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginForm from "./_LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="bg-[#6B7C8F] text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={80}
            height={80}
            // className="h-12 w-12 md:h-20 md:w-20"
          />
          <span className="font-bold tracking-wide hidden sm:inline">
            Westpoint Capital & Recovery
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:underline">Home</Link>
          <Link href="/claim" className="hover:underline">Claim Inquiry</Link>
          <Link href="/how-it-works" className="hover:underline">How it Works</Link>
          <Link href="/about" className="hover:underline">About</Link>
          {/* Logout Button */}
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-3 py-1.5 text-lg font-medium shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </form>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white text-gray-900 shadow-xl transform transition-transform md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
            <span className="font-semibold">Westpoint</span>
          </div>
          <button
            type="button"
            className="rounded-md p-2 hover:bg-gray-100"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="p-4 text-sm space-y-2">
          <MobileLink href="/dashboard" onClick={() => setOpen(false)}>Home</MobileLink>
          <MobileLink href="/claim" onClick={() => setOpen(false)}>Claim Inquiry</MobileLink>
          <MobileLink href="/how-it-works" onClick={() => setOpen(false)}>How it Works</MobileLink>
          <MobileLink href="/about" onClick={() => setOpen(false)}>About</MobileLink>

          {/* Logout inside mobile menu */}
          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button
              type="submit"
              className="w-full rounded-md bg-red-500 px-3 py-2 text-white font-medium shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </form>
        </nav>
      </aside>
    </header>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-3 py-3 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

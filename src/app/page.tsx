import Image from "next/image";
import Link from "next/link";


export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      {/* HEADER */}
      <header className="bg-[#6B7C8F] text-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + Name */}
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

          {/* Sign in */}
          <Link
            href="/signup"
            className="rounded-md border border-white/40 px-4 py-2 text-sm font-medium hover:bg-white/10 transition"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-[#2876A7]">
              Helping You Recover What’s Legally Yours
            </h1>
            <p className="mt-5 text-gray-700 leading-relaxed">
              We coordinate asset recovery related to foreclosures, tax sales,
              court-held surpluses, estate disbursements, and public fund
              releases. No upfront fees—ever.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/claim"
                className="inline-flex items-center justify-center rounded-md bg-[#F2B705] px-5 py-3 text-sm font-semibold text-gray-900 shadow hover:brightness-95 transition"
              >
                Start a Claim
              </a>
              <a
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
              >
                How it Works
              </a>
            </div>

            {/* Small trust strip */}
            <div className="mt-6 text-xs text-gray-600">
              No legal advice provided. All filings handled by licensed
              attorneys under written agreement.
            </div>
          </div>

          <div className="order-first md:order-none">
            <div className="rounded-lg border shadow-sm overflow-hidden">
              <Image
                src="/images/hero.png"
                alt="Calculator, documents, and house model"
                width={1600}
                height={1200}
                priority
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURES */}
      <section className="bg-white/60 border-t">
        <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            title="No Upfront Fees"
            text="We advance eligible legal and filing costs; you only pay from recovered funds."
          />
          <Feature
            title="Licensed Attorneys"
            text="Cases are handled through our national network of licensed attorneys."
          />
          <Feature
            title="Secure & Compliant"
            text="Documentation reviewed for accuracy, eligibility, and proper routing."
          />
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-[#2876A7] text-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <h2 className="text-xl font-semibold text-center md:text-left">
            Unsure if you have a recoverable claim?
          </h2>
          <div className="flex gap-3">
            <a
              href="/claim"
              className="rounded-md bg-[#F2B705] px-5 py-2.5 text-gray-900 font-semibold shadow hover:brightness-95 transition"
            >
              Check Eligibility
            </a>
            <a
              href="/about"
              className="rounded-md bg-white/10 px-5 py-2.5 text-white font-semibold hover:bg-white/20 transition"
            >
              About Us
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 grid gap-6 md:grid-cols-3 text-sm text-gray-700">
          <div>✉️ info@wpcalrecovery.com</div>
          <div>📞 (888) 000-4770</div>
          <div>🕒 6:00 AM – 6:00 PM Eastern Time</div>
        </div>
      </section>

     
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{text}</p>
    </div>
  );
}

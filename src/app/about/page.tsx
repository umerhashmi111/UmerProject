import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AboutPage() {
     const session = await getSession();
      if (!session.userId) redirect("/login");
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2876A7] text-center">
            About Westpoint Capital & Recovery
          </h1>

          {/* Hero Image */}
          <div className="mt-6 rounded-lg overflow-hidden border">
            {/* Replace with your actual image path if different */}
            <Image
              src="/images/hero.png"
              alt="About Westpoint Capital & Recovery"
              width={800}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Body Copy */}
          <div className="mt-6 space-y-4 text-sm md:text-[15px] leading-relaxed text-gray-700">
            <p>
              Westpoint Capital & Recovery, Inc. is a national financial coordination and claim
              management firm focused on recovery services tied to foreclosure auctions, tax sales,
              surplus disbursements, estate settlements, and public fund releases. We serve families,
              heirs, and rightful claimants by managing the full recovery lifecycle from asset discovery to legal filing.
            </p>
            <p>
              We work with licensed attorneys, fiduciaries, and legal specialists to verify claims and
              execute documentation on behalf of our clients. Our role is administrative and strategic—
              we do not offer legal advice and are not a law firm.
            </p>
            <p>
              We service clients in all 50 states, operating with transparency, compliance, and a client-first
              standard of care. Our internal process ensures each claim is reviewed thoroughly for eligibility
              and compliance with court and agency regulations.
            </p>
          </div>

          {/* Contact strip (like in your screenshot) */}
          <div className="mt-8 grid gap-4 md:grid-cols-3 text-sm text-gray-700">
            <div>✉️ info@wpcalrecovery.com</div>
            <div>📞 (888) 000-4770</div>
            <div>🕒 6:00 AM – 6:00 PM Eastern Time</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

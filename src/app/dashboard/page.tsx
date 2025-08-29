import { redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/session";
import { connectMongo } from "@/lib/mongoose";
import { Tree } from "@/models/Tree";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  await connectMongo();
  const hasTree = await Tree.exists({ ownerId: session.userId }).lean();
  if (!hasTree) redirect("/onboarding");

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      {/* HERO */}
      <section className="bg-white flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#2876A7] text-center">
            Helping You Recover What’s<br className="hidden md:block" /> Legally Yours
          </h1>

          <div className="mt-8">
            <Image
              src="/images/hero.png"
              alt="Calculator, documents, and house model"
              width={1600}
              height={900}
              className="rounded-lg border shadow-sm"
              priority
            />
          </div>

          <div className="mt-8 space-y-5 text-gray-700 leading-relaxed">
            <p>
              Westpoint Capital & Recovery, Inc. is a national financial coordination firm
              specializing in asset recovery connected to foreclosure proceedings—both
              before and after auction. Our services span multiple claim types, including
              court-held surpluses, sheriff sale overages, estate disbursements, surplus
              trustee funds, and administrative financial entitlements released through
              state and municipal agencies.
            </p>
            <p>
              Our team supports heirs, family members, property owners, and lawful
              claimants by coordinating research, organizing required documentation, and
              engaging licensed attorneys to complete filings. We do not charge upfront
              fees. Each case is reviewed for accuracy, eligibility, and proper legal
              routing prior to submission.
            </p>

            <div className="pt-2 text-center">
              <a
                href="/tree/search"
                className="inline-block rounded-md bg-[#F2B705] px-5 py-3 text-sm font-semibold text-gray-900 shadow hover:brightness-95 transition"
              >
                Check If You’re Owed Funds
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION CARDS */}
      <section className="bg-white/60 border-t">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/tree/personal"
              className="block rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Personal Family Tree
              </h2>
              <p className="text-sm text-gray-600">
                Enter your code to view / edit your family tree.
              </p>
            </a>

            <a
              href="/tree/search"
              className="block rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Search by CNIC
              </h2>
              <p className="text-sm text-gray-600">
                Find trees where a CNIC appears.
              </p>
            </a>
          </div>

        
        </div>
      </section>

      <Footer />
    </main>
  );
}

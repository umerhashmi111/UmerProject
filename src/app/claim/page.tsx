import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClaimForm from "@/components/ClaimForm";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ClaimPage() {
    const session = await getSession();
      if (!session.userId) redirect("/login");
  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <section className="bg-white">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2876A7] text-center">
            Find Out if You Have a Recoverable Claim
          </h1>
          <p className="mt-3 text-center text-gray-700 text-sm md:text-[15px]">
            Submit your information securely using the form below. Our team will review your submission.
          </p>

          {/* <div className="mt-6 rounded-lg overflow-hidden border">
            <Image src="/images/hero.jpg" alt="Desk with documents" width={1600} height={900} priority />
          </div> */}

          <ClaimForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}

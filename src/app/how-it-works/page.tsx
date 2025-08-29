import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HowItWorksPage() {
     const session = await getSession();
      if (!session.userId) redirect("/login");
  const steps = [
    {
      number: 1,
      title: "Submit an Inquiry",
      description: "Submit your inquiry securely through our intake form",
    },
    {
      number: 2,
      title: "Verification of Claim Details",
      description:
        "Our internal team evaluates court, agency, and foreclosure-related records to confirm potential eligibility",
    },
    {
      number: 3,
      title: "Review & Sign the Agreement",
      description:
        "If eligible, you are provided with a formal recovery engagement agreement",
    },
    {
      number: 4,
      title: "Assignment of a Licensed Attorney",
      description:
        "You are assigned to a licensed attorney within our national partner network who will prepare and file any required legal documents",
    },
    {
      number: 5,
      title: "Receive Your Recovery Funds",
      description:
        "Once funds are approved and released by the appropriate authority, disbursement is completed to the rightful claimant",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <Header />

      <section className="bg-white flex-grow">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2876A7] text-center mb-10">
            How the Claim Process Works ?
          </h1>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2876A7] text-white flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">{step.title}</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <p className="mt-10 text-xs text-gray-600 leading-relaxed">
            <b>Note:</b> Clients are never charged upfront. Westpoint covers all
            legal and filing fees in advance. Every recovery is managed by
            experienced case handlers and licensed attorneys under written
            agreement.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

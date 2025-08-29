import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { connectMongo } from "@/lib/mongoose";
import { Tree } from "@/models/Tree";
import OnboardingModal from "./ui/OnboardingModal";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session.userId) redirect("/login");

  await connectMongo();
  const hasTree = await Tree.exists({ ownerId: session.userId }).lean();
  if (hasTree) redirect("/dashboard"); // already done

  return <OnboardingModal />;
}

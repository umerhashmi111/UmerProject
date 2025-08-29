import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { getSession } from "@/lib/session";
import { Tree } from "@/models/Tree";

export async function GET() {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ ok: false, treeId: null });

  await connectMongo();
  const t = await Tree.findOne({ ownerId: session.userId }).select("_id").lean();
  return NextResponse.json({ ok: true, treeId: t ? String(t._id) : null });
}

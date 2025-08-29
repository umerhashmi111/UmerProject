import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { connectMongo } from "@/lib/mongoose";
import { Tree } from "@/models/Tree";
import { TreeOtp } from "@/models/TreeOtp";
import { otpVerifySchema } from "@/lib/ValidationTree";
import { sha256Hex } from "@/lib/crypto";

export async function POST(req: Request) {
  try {
    const { treeId, code } = otpVerifySchema.parse(await req.json());
    await connectMongo();

    const otp = await TreeOtp.findOne({ treeId }).sort({ createdAt: -1 }).exec();
    if (!otp) return NextResponse.json({ error: "Code not found" }, { status: 400 });
    if (otp.expiresAt < new Date()) return NextResponse.json({ error: "Code expired" }, { status: 400 });

    const ok = otp.codeHash === sha256Hex(code);
    if (!ok) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const tree = await Tree.findById(treeId).lean();
    if (!tree) return NextResponse.json({ error: "Tree not found" }, { status: 404 });

    return NextResponse.json({ ok: true, tree });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("TREE_VERIFY_ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

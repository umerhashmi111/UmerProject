import { NextResponse } from "next/server";
import {  ZodError } from "zod";
import { connectMongo } from "@/lib/mongoose";
import { getSession } from "@/lib/session";
import { Tree } from "@/models/Tree";
import { TreeOtp } from "@/models/TreeOtp";
import { treeCreateSchema } from "@/lib/ValidationTree";
import { genOtp, sha256Hex } from "@/lib/crypto";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.userId || !session.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = treeCreateSchema.parse(await req.json());
    await connectMongo();

    const tree = await Tree.create({
      ownerId: session.userId,
      ownerEmail: session.email,
      title: payload.title,
      owner: payload.owner,
      persons: payload.persons,
    });

    const code = genOtp(6);
    const codeHash = sha256Hex(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await TreeOtp.create({ treeId: tree._id, codeHash, expiresAt });

    let emailed = true;
    try {
      if (process.env.RESEND_API_KEY && process.env.MAIL_FROM) {
        await sendOtpEmail(session.email, code, payload.title);
      } else {
        emailed = false;
      }
    } catch (e) {
      console.error("OTP_EMAIL_ERROR:", e);
      emailed = false;
    }

    return NextResponse.json({ ok: true, treeId: String(tree._id), emailed }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("TREE_CREATE_ERROR:", err);
    return NextResponse.json({ error: "Internal error creating tree" }, { status: 500 });
  }
}

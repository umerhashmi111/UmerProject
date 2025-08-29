import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ZodError } from "zod";
import { signupSchema } from "@/lib/Validation";
import { connectMongo } from "@/lib/mongoose";
import { User } from "@/models/User";

/** Type guard to check for a plain object */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

/** Mongo duplicate key (E11000) without using `any` */
function isDuplicateKeyError(err: unknown): boolean {
  if (!isRecord(err)) return false;
  const code = err.code;
  return typeof code === "number" && code === 11000;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = signupSchema.parse(body);

    await connectMongo();

    const exists = await User.findOne({ email }).lean().exec();
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await User.create({ email, passwordHash });

    return NextResponse.json({ ok: true, userId: String(created._id) }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const msg = err.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    if (isDuplicateKeyError(err)) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

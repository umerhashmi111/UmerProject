import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { z, ZodError } from "zod";
import { connectMongo } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Tree } from "@/models/Tree"; // ⬅️ add
import { getSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { email, password } = loginSchema.parse(await req.json());
    await connectMongo();

    const user = await User.findOne({ email }).exec();
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const session = await getSession();
    session.userId = String(user._id);
    session.email = user.email;
    await session.save();

    // NEW: check if this user already has a tree
    const hasTree = await Tree.exists({ ownerId: String(user._id) }).lean();

    return NextResponse.json({ ok: true, hasTree: Boolean(hasTree) });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ error: err.issues[0]?.message ?? "Invalid input" }, { status: 400 });
    }
    console.error("LOGIN_ROUTE_ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

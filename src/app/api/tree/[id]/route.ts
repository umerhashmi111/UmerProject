import { NextResponse, NextRequest } from "next/server";
import { ZodError } from "zod";
import { connectMongo } from "@/lib/mongoose";
import { getSession } from "@/lib/session";
import { Tree } from "@/models/Tree";
import { treeUpdateSchema } from "@/lib/ValidationTree";

type ContextNow = { params: { id: string } };
type ContextFuture = { params: Promise<{ id: string }> };
type Context = ContextNow | ContextFuture;

function isPromise<T>(v: unknown): v is Promise<T> {
  // simple duck-typing check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!v && typeof (v as any).then === "function";
}

export async function PATCH(req: NextRequest, ctx: Context) {
  try {
    const session = await getSession();
    if (!session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Support both Next <=13/14 style and the newer "params is a Promise" style
    const rawParams = ctx.params;
    const { id } = isPromise<{ id: string }>(rawParams) ? await rawParams : rawParams;

    const body = await req.json();
    const patch = treeUpdateSchema.parse(body);

    await connectMongo();

    // Build $set dynamically so we only update provided fields
    const $set: Record<string, unknown> = {};
    if (patch.title !== undefined) $set.title = patch.title;
    if (patch.owner !== undefined) $set.owner = patch.owner;
    if (patch.persons !== undefined) $set.persons = patch.persons;

    const updated = await Tree.findOneAndUpdate(
      { _id: id, ownerId: session.userId },
      { $set },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { error: "Tree not found or not yours" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }
    console.error("TREE_UPDATE_ERROR:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

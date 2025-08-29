import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Tree } from "@/models/Tree";

type Person = {
  fullName?: string;
  gender?: string;
  cnic?: string;
  relationToOwner?: string;
  address?: string;
};

type Owner = {
  fullName?: string;
  cnic?: string;
};

type TreeRow = {
  _id: unknown;
  title?: string;
  owner?: Owner | null;
  persons?: Person[] | null;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cnic = (searchParams.get("cnic") || "").trim();

  // Allow 5-7-1 with dashes OR 13 contiguous digits
  if (!/^\d{5}-\d{7}-\d$|^\d{13}$/.test(cnic)) {
    return NextResponse.json({ error: "Invalid CNIC" }, { status: 400 });
  }

  await connectMongo();

  // Find trees where this CNIC appears among persons OR owner's CNIC
  const trees = await Tree.find({
    $or: [{ "persons.cnic": cnic }, { "owner.cnic": cnic }],
  })
    .select({ title: 1, owner: 1, persons: 1 })
    .lean<TreeRow[]>(); // ⬅️ get plain objects with our shape

  const results = trees.map((t) => {
    const persons = t.persons ?? [];
    const owner = t.owner ?? null;

    // find matching person; if not, consider owner as match
    const matchPerson: Person | null =
      persons.find((p) => p?.cnic === cnic) ??
      (owner?.cnic === cnic
        ? { fullName: owner.fullName, cnic: owner.cnic, relationToOwner: "OWNER" }
        : null);

    return {
      treeId: String(t._id),
      title: t.title ?? "",
      ownerName: owner?.fullName ?? "",
      person: matchPerson
        ? {
            fullName: matchPerson.fullName ?? "",
            gender: matchPerson.gender ?? "",
            cnic: matchPerson.cnic ?? "",
            relationToOwner: matchPerson.relationToOwner ?? "OWNER",
            address: matchPerson.address ?? "",
          }
        : null,
    };
  });

  return NextResponse.json({ ok: true, results });
}

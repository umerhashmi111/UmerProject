"use client";

import { useEffect, useState } from "react";


type Gender = "male" | "female" | "other";
type Relation =
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "SIBLING"
  | "SPOUSE"
  | "OTHER";

type Owner = { fullName: string; gender: Gender; cnic: string; address: string };
type Person = {
  fullName: string;
  gender: Gender;
  cnic: string;
  relationToOwner: Relation;
  address: string;
};

type Tree = {
  _id?: string;
  title: string;
  owner: Owner;
  persons: Person[];
};

type MineResponse = { treeId?: string | null } | { error: string };
type VerifyResponse =
  | { tree: unknown } // we will normalize it
  | { error: string };
type PatchResponse = { ok?: boolean; error?: string };

const OWNER_DEFAULT: Owner = {
  fullName: "",
  gender: "male",
  cnic: "",
  address: "",
};
const PERSON_DEFAULT: Person = {
  fullName: "",
  gender: "male",
  cnic: "",
  relationToOwner: "OTHER",
  address: "",
};

function normalizeOwner(o: unknown): Owner {
  const obj = typeof o === "object" && o !== null ? (o as Record<string, unknown>) : {};
  const gender = obj.gender === "male" || obj.gender === "female" || obj.gender === "other" ? obj.gender : "male";
  return {
    fullName: typeof obj.fullName === "string" ? obj.fullName : "",
    gender,
    cnic: typeof obj.cnic === "string" ? obj.cnic : "",
    address: typeof obj.address === "string" ? obj.address : "",
  };
}

function normalizePerson(p: unknown): Person {
  const obj = typeof p === "object" && p !== null ? (p as Record<string, unknown>) : {};
  const gender = obj.gender === "male" || obj.gender === "female" || obj.gender === "other" ? obj.gender : "male";
  const rel: Relation =
    obj.relationToOwner === "FATHER" ||
    obj.relationToOwner === "MOTHER" ||
    obj.relationToOwner === "SON" ||
    obj.relationToOwner === "DAUGHTER" ||
    obj.relationToOwner === "SIBLING" ||
    obj.relationToOwner === "SPOUSE" ||
    obj.relationToOwner === "OTHER"
      ? (obj.relationToOwner as Relation)
      : "OTHER";
  return {
    fullName: typeof obj.fullName === "string" ? obj.fullName : "",
    gender,
    cnic: typeof obj.cnic === "string" ? obj.cnic : "",
    relationToOwner: rel,
    address: typeof obj.address === "string" ? obj.address : "",
  };
}

function normalizeTree(t: unknown): Tree {
  const obj = typeof t === "object" && t !== null ? (t as Record<string, unknown>) : {};
  const personsRaw = Array.isArray(obj.persons) ? obj.persons : [];
  return {
    _id: obj._id != null ? String(obj._id) : undefined,
    title: typeof obj.title === "string" ? obj.title : "",
    owner: normalizeOwner(obj.owner),
    persons: personsRaw.map(normalizePerson),
  };
}

export default function PersonalTreePage() {
 

  const [treeId, setTreeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState<Tree | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/tree/mine");
        const ct = res.headers.get("content-type") || "";
        const data: MineResponse = ct.includes("application/json") ? await res.json() : { error: await res.text() };
        if ("error" in data) {
          // no tree or not logged in; keep null
          setTreeId(null);
        } else {
          setTreeId(typeof data.treeId === "string" ? data.treeId : null);
        }
      } catch {
        setTreeId(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function verify() {
    if (!treeId) {
      alert("No tree found for your account.");
      return;
    }
    const res = await fetch("/api/tree/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ treeId, code }),
    });
    const ct = res.headers.get("content-type") || "";
    const data: VerifyResponse = ct.includes("application/json") ? await res.json() : { error: await res.text() };

    if ("tree" in data) {
      setTree(normalizeTree(data.tree));
    } else {
      alert(data.error || "Invalid code");
    }
  }

  async function save() {
    if (!treeId || !tree) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/tree/${treeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tree.title,
          owner: tree.owner,
          persons: tree.persons,
        }),
      });
      const ct = res.headers.get("content-type") || "";
      const data: PatchResponse = ct.includes("application/json") ? await res.json() : { error: await res.text() };

      if (res.ok && (data.ok ?? true)) {
        alert("Saved!");
      } else {
        alert(data.error || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="p-6">Loading…</main>;

  if (!tree) {
    return (
      <main className="p-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Personal Family Tree</h1>
        <p className="text-sm text-gray-600 mb-3">Enter the 6-digit code sent to your email.</p>
        <div className="flex gap-2">
          <input
            className="border p-2 rounded w-40"
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          <button onClick={verify} className="px-4 py-2 bg-blue-600 text-white rounded">
            Open
          </button>
        </div>
      </main>
    );
  }

  // Safe access via local variables
  const o = tree.owner ?? OWNER_DEFAULT;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Family Tree</h1>

      <section className="space-y-2">
        <label className="block text-sm font-medium">Title</label>
        <input
          className="border p-2 rounded w-full max-w-lg"
          value={tree.title ?? ""}
          onChange={(e) => setTree({ ...tree, title: e.target.value })}
        />
      </section>

      <section className="space-y-2">
        <h2 className="font-semibold">Owner</h2>
        <div className="grid sm:grid-cols-2 gap-2 max-w-2xl">
          <input
            className="border p-2 rounded"
            placeholder="Full name"
            value={o.fullName}
            onChange={(e) => setTree({ ...tree, owner: { ...o, fullName: e.target.value } })}
          />
          <select
            className="border p-2 rounded"
            value={o.gender}
            onChange={(e) => setTree({ ...tree, owner: { ...o, gender: e.target.value as Owner["gender"] } })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            className="border p-2 rounded"
            placeholder="CNIC"
            value={o.cnic}
            onChange={(e) => setTree({ ...tree, owner: { ...o, cnic: e.target.value } })}
          />
          <input
            className="border p-2 rounded"
            placeholder="Address"
            value={o.address}
            onChange={(e) => setTree({ ...tree, owner: { ...o, address: e.target.value } })}
          />
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Persons</h2>
          <button
            className="text-sm underline"
            onClick={() =>
              setTree({
                ...tree,
                persons: [...(tree.persons ?? []), { ...PERSON_DEFAULT }],
              })
            }
          >
            + Add Person
          </button>
        </div>

        {(tree.persons ?? []).map((p, i) => {
          const pi = normalizePerson(p);
          return (
            <div key={i} className="grid sm:grid-cols-5 gap-2 border rounded p-3">
              <input
                className="border p-2 rounded"
                placeholder="Full name"
                value={pi.fullName}
                onChange={(e) => {
                  const copy = [...(tree.persons ?? [])];
                  copy[i] = { ...pi, fullName: e.target.value };
                  setTree({ ...tree, persons: copy });
                }}
              />
              <select
                className="border p-2 rounded"
                value={pi.gender}
                onChange={(e) => {
                  const copy = [...(tree.persons ?? [])];
                  copy[i] = { ...pi, gender: e.target.value as Gender };
                  setTree({ ...tree, persons: copy });
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                className="border p-2 rounded"
                placeholder="CNIC"
                value={pi.cnic}
                onChange={(e) => {
                  const copy = [...(tree.persons ?? [])];
                  copy[i] = { ...pi, cnic: e.target.value };
                  setTree({ ...tree, persons: copy });
                }}
              />
              <select
                className="border p-2 rounded"
                value={pi.relationToOwner}
                onChange={(e) => {
                  const copy = [...(tree.persons ?? [])];
                  copy[i] = { ...pi, relationToOwner: e.target.value as Relation };
                  setTree({ ...tree, persons: copy });
                }}
              >
                <option value="FATHER">FATHER</option>
                <option value="MOTHER">MOTHER</option>
                <option value="SON">SON</option>
                <option value="DAUGHTER">DAUGHTER</option>
                <option value="SIBLING">SIBLING</option>
                <option value="SPOUSE">SPOUSE</option>
                <option value="OTHER">OTHER</option>
              </select>
              <input
                className="border p-2 rounded"
                placeholder="Address"
                value={pi.address}
                onChange={(e) => {
                  const copy = [...(tree.persons ?? [])];
                  copy[i] = { ...pi, address: e.target.value };
                  setTree({ ...tree, persons: copy });
                }}
              />
              <div className="sm:col-span-5 flex justify-end">
                <button
                  className="text-sm text-red-600 underline"
                  onClick={() => {
                    const copy = (tree.persons ?? []).filter((_, idx) => idx !== i);
                    setTree({ ...tree, persons: copy });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </main>
  );
}

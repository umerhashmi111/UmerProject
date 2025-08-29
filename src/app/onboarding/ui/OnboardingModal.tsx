"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Gender = "male" | "female" | "other";
type Relation =
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "SIBLING"
  | "SPOUSE"
  | "OTHER";

type Owner = {
  fullName: string;
  gender: Gender;
  cnic: string;
  address: string;
};

type Person = {
  fullName: string;
  gender: Gender;
  cnic: string;
  relationToOwner: Relation;
  address: string;
};

type ApiResponse =
  | { ok: true }
  | { ok?: false; error: string }; // cover error case

const CNIC_HINT = "#####-#######-# or 13 digits";

export default function OnboardingModal() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState<Owner>({
    fullName: "",
    gender: "male",
    cnic: "",
    address: "",
  });

  const [persons, setPersons] = useState<Person[]>([
    {
      fullName: "",
      gender: "male",
      cnic: "",
      relationToOwner: "OTHER",
      address: "",
    },
  ]);

  const [busy, setBusy] = useState(false);

  function updatePerson(i: number, patch: Partial<Person>) {
    setPersons((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function addPerson() {
    setPersons((prev) => [
      ...prev,
      {
        fullName: "",
        gender: "male",
        cnic: "",
        relationToOwner: "OTHER",
        address: "",
      },
    ]);
  }

  function removePerson(i: number) {
    setPersons((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // simple client-side guard
    if (!title.trim()) return alert("Please enter a tree title.");
    if (!owner.fullName.trim() || !owner.cnic.trim() || !owner.address.trim())
      return alert("Please complete owner details.");
    if (persons.length < 1) return alert("Please add at least one person.");

    setBusy(true);

    const res = await fetch("/api/tree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, owner, persons }),
    });

    const ct = res.headers.get("content-type") || "";
    const data: ApiResponse = ct.includes("application/json")
      ? await res.json()
      : { ok: false, error: await res.text() };

    setBusy(false);

    if (res.ok && "ok" in data && data.ok) {
      alert(
        "Family tree saved. A 6-digit code has been emailed (if email is configured)."
      );
      router.replace("/dashboard");
    } else {
      alert("error" in data ? data.error : `Failed (${res.status})`);
    }
  }

  // Full-screen modal overlay
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
        <h1 className="text-xl font-bold mb-1">Complete your Family Tree</h1>
        <p className="text-sm text-gray-600 mb-4">
          This is required once. You’ll go to your dashboard after saving.
        </p>

        <form onSubmit={submit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Tree Title</label>
            <input
              className="border p-2 w-full rounded"
              placeholder="e.g., Khan Family"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Owner */}
          <section className="space-y-2">
            <h2 className="font-semibold">Owner</h2>
            <div className="grid md:grid-cols-2 gap-2">
              <input
                className="border p-2 rounded"
                placeholder="Full name"
                value={owner.fullName}
                onChange={(e) => setOwner({ ...owner, fullName: e.target.value })}
                required
              />
              <select
                className="border p-2 rounded"
                value={owner.gender}
                onChange={(e) =>
                  setOwner({ ...owner, gender: e.target.value as Owner["gender"] })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                className="border p-2 rounded"
                placeholder={`CNIC (${CNIC_HINT})`}
                value={owner.cnic}
                onChange={(e) => setOwner({ ...owner, cnic: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="Address"
                value={owner.address}
                onChange={(e) => setOwner({ ...owner, address: e.target.value })}
                required
              />
            </div>
          </section>

          {/* Persons */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Persons</h2>
              <button
                type="button"
                onClick={addPerson}
                className="text-sm underline"
              >
                + Add Person
              </button>
            </div>

            {persons.map((p, i) => (
              <div key={i} className="grid md:grid-cols-5 gap-2 border rounded p-3">
                <input
                  className="border p-2 rounded"
                  placeholder="Full name"
                  value={p.fullName}
                  onChange={(e) => updatePerson(i, { fullName: e.target.value })}
                  required
                />
                <select
                  className="border p-2 rounded"
                  value={p.gender}
                  onChange={(e) =>
                    updatePerson(i, { gender: e.target.value as Person["gender"] })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  className="border p-2 rounded"
                  placeholder={`CNIC (${CNIC_HINT})`}
                  value={p.cnic}
                  onChange={(e) => updatePerson(i, { cnic: e.target.value })}
                  required
                />
                <select
                  className="border p-2 rounded"
                  value={p.relationToOwner}
                  onChange={(e) =>
                    updatePerson(i, {
                      relationToOwner: e.target.value as Person["relationToOwner"],
                    })
                  }
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
                  value={p.address}
                  onChange={(e) => updatePerson(i, { address: e.target.value })}
                  required
                />

                <div className="md:col-span-5 flex justify-end">
                  {persons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePerson(i)}
                      className="text-sm text-red-600 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

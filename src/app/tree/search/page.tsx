"use client";

import { useState } from "react";

type Card = {
  treeId: string;
  title: string;
  ownerName: string;
  person: { fullName: string; gender: string; cnic: string; relationToOwner: string; address: string } | null;
};

export default function TreeSearchPage() {
  const [cnic, setCnic] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<Card[]>([]);

  async function search() {
    setBusy(true);
    const res = await fetch(`/api/tree/search?cnic=${encodeURIComponent(cnic)}`);
    const data = await res.json();
    setBusy(false);
    if (res.ok) setResults(data.results);
    else alert(data.error || "Search failed");
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Search by CNIC</h1>
      <div className="flex gap-2 max-w-xl">
        <input
          className="border p-2 rounded flex-1"
          placeholder="#####-#######-# or 13 digits"
          value={cnic}
          onChange={(e) => setCnic(e.target.value)}
        />
        <button onClick={search} disabled={busy} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          {busy ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {results.map((r) => (
          <div key={r.treeId} className="border rounded-xl p-4">
            <h3 className="font-semibold">{r.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Owner: {r.ownerName}</p>
            {r.person ? (
              <div className="text-sm space-y-1">
                <div><b>Name:</b> {r.person.fullName}</div>
                <div><b>Gender:</b> {r.person.gender}</div>
                <div><b>CNIC:</b> {r.person.cnic}</div>
                <div><b>Relation with owner:</b> {r.person.relationToOwner}</div>
                <div><b>Address:</b> {r.person.address}</div>
              </div>
            ) : (
              <p className="text-sm text-red-600">No personal details found.</p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

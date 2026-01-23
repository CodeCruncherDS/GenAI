"use client";
import { useState } from "react";
import { askAdvisor } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";

export default function Advisor() {
  const [shop, setShop] = useState("default");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const [recs, setRecs] = useState<any[]>([]);
  const [followups, setFollowups] = useState<string[]>([]);

  async function onAsk() {
    const question = q.trim();
    if (!question || loading) return;
    setLoading(true);
    try {
      const res = await askAdvisor({ question, shop });
      setAnswer(res.raw_answer);
      const structured = res.structured;
      setRecs(structured?.recommendations || []);
      setFollowups(structured?.followups || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-600">Shop</label>
        <input value={shop} onChange={(e) => setShop(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onAsk() : null)}
          className="flex-1 min-w-[240px] rounded border px-3 py-2 text-sm"
          placeholder="e.g., Best headphones under $150 for calls"
        />
        <button onClick={onAsk} className="rounded border px-3 py-2 text-sm">Ask</button>
      </div>

      {loading && <div className="text-sm text-neutral-500">Thinking…</div>}
      <ProductGrid recommendations={recs} />

      {followups?.length > 0 && (
        <div className="rounded border p-3">
          <div className="text-sm font-medium mb-2">Follow-ups</div>
          <ul className="list-disc pl-5 text-sm">
            {followups.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}

      {answer && (
        <details className="rounded border p-3">
          <summary className="text-sm cursor-pointer">Raw model output</summary>
          <pre className="mt-2 whitespace-pre-wrap text-xs">{answer}</pre>
        </details>
      )}
    </div>
  );
}

"use client";

export default function ProductGrid({ recommendations }: { recommendations: any[] }) {
  if (!recommendations?.length) {
    return <div className="text-sm text-neutral-500">No recommendations yet.</div>;
  }

  function toggleCompare(sku: string) {
    const set = new Set<string>((window as any).__compareSkus || []);
    if (set.has(sku)) set.delete(sku);
    else set.add(sku);
    (window as any).__compareSkus = Array.from(set);
    window.dispatchEvent(new Event("compare:update"));
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {recommendations.map((r, i) => (
        <div key={i} className="rounded-lg border p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-medium">SKU: {r.sku}</div>
              <div className="text-xs text-neutral-500">{r.best_for}</div>
            </div>
            <button onClick={() => toggleCompare(r.sku)} className="rounded border px-2 py-1 text-xs">
              Compare
            </button>
          </div>

          <div className="mt-2 text-sm">{r.why}</div>

          {r.pros?.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium">Pros</div>
              <ul className="list-disc pl-5 text-xs">
                {r.pros.slice(0, 3).map((p: string, idx: number) => <li key={idx}>{p}</li>)}
              </ul>
            </div>
          )}

          {r.cons?.length > 0 && (
            <div className="mt-2">
              <div className="text-xs font-medium">Cons</div>
              <ul className="list-disc pl-5 text-xs">
                {r.cons.slice(0, 3).map((c: string, idx: number) => <li key={idx}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

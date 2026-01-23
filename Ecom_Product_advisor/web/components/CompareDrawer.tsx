"use client";
import { useEffect, useState } from "react";
import { compareSkus } from "@/lib/api";

export default function CompareDrawer() {
  const [shop, setShop] = useState("default");
  const [skus, setSkus] = useState<string[]>([]);
  const [out, setOut] = useState<string>("");

  useEffect(() => {
    function update() {
      setSkus((window as any).__compareSkus || []);
    }
    update();
    window.addEventListener("compare:update", update);
    return () => window.removeEventListener("compare:update", update);
  }, []);

  async function onCompare() {
    if (skus.length < 2) return;
    const res = await compareSkus({ shop, skus });
    setOut(res.answer);
  }

  return (
    <div className="rounded-lg border p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-medium">Compare</div>
        <input value={shop} onChange={(e) => setShop(e.target.value)} className="w-28 rounded border px-2 py-1 text-xs" />
      </div>

      <div className="mt-2 text-xs text-neutral-600">Selected: {skus.join(", ") || "None"}</div>

      <button onClick={onCompare} className="mt-2 w-full rounded border px-3 py-2 text-sm">
        Run comparison
      </button>

      {out && (
        <pre className="mt-2 max-h-[60vh] overflow-auto whitespace-pre-wrap rounded border p-2 text-xs">
          {out}
        </pre>
      )}
    </div>
  );
}

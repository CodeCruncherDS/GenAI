"use client";
import { useEffect, useState } from "react";

type Source = { text: string; metadata?: any; distance: number };

export default function Sources() {
  const [sources, setSources] = useState<Source[]>([]);

  useEffect(() => {
    function update() {
      const s = (window as any).__lastSources || [];
      setSources(s);
    }
    update();
    window.addEventListener("sources:update", update);
    return () => window.removeEventListener("sources:update", update);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Retrieved Context</div>
      <div className="max-h-[38vh] overflow-auto rounded border p-2">
        {sources.length === 0 ? (
          <div className="text-xs text-neutral-500">No sources yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {sources.map((s, i) => (
              <div key={i} className="rounded border p-2 text-xs">
                <div className="mb-1 text-[11px] text-neutral-500">
                  distance: {Number(s.distance).toFixed(4)} {s.metadata?.source ? `| ${s.metadata.source}` : ""}
                </div>
                <div className="line-clamp-6 whitespace-pre-wrap">{s.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

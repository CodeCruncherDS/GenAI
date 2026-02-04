"use client";
import { useEffect, useState } from "react";

type Source = { text: string; metadata?: any; distance: number };

export default function Sources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    function update() {
      const s = (window as any).__lastSources || [];
      setSources(s);
      setExpanded([]); // Reset expansion on new search
    }
    update();
    window.addEventListener("sources:update", update);
    return () => window.removeEventListener("sources:update", update);
  }, []);

  const toggle = (i: number) => {
    setExpanded((prev) =>
      prev.includes(i) ? prev.filter((idx) => idx !== i) : [...prev, i]
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Retrieved Context</div>
      <div className="max-h-[60vh] overflow-auto rounded border bg-neutral-50 p-2">
        {sources.length === 0 ? (
          <div className="text-xs text-neutral-500">No sources yet.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {sources.map((s, i) => {
              const isExpanded = expanded.includes(i);
              return (
                <div key={i} className="rounded border bg-white p-2 text-xs shadow-sm transition-all">
                  <div
                    onClick={() => toggle(i)}
                    className="mb-1 flex cursor-pointer items-center justify-between text-[11px] font-medium text-neutral-500 hover:text-neutral-800"
                  >
                    <span>
                      Result #{i + 1} (Dist: {Number(s.distance).toFixed(3)})
                      {s.metadata?.source ? ` | ${s.metadata.source}` : ""}
                    </span>
                    <span>{isExpanded ? "▼" : "▶"}</span>
                  </div>
                  <div
                    className={`whitespace-pre-wrap font-mono text-neutral-700 ${isExpanded ? "" : "line-clamp-3"
                      }`}
                  >
                    {s.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { ask } from "@/lib/api";

export default function Chat() {
  const [project, setProject] = useState("default");
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSend() {
    const question = q.trim();
    if (!question || loading) return;
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setQ("");
    setLoading(true);
    try {
      const res = await ask({ question, project });
      setMsgs((m) => [...m, { role: "assistant", text: res.answer }]);
      (window as any).__lastSources = res.sources;
      window.dispatchEvent(new Event("sources:update"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[70vh] flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-neutral-600">Project</label>
        <input value={project} onChange={(e) => setProject(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm" />
      </div>

      <div className="flex-1 overflow-auto rounded border bg-white p-3">
        <div className="flex flex-col gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "self-end max-w-[85%]" : "self-start max-w-[85%]"}>
              <div className="rounded-lg border px-3 py-2 text-sm leading-relaxed">
                <div className="mb-1 text-xs text-neutral-500">{m.role}</div>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-neutral-500">Thinking…</div>}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? onSend() : null)}
          className="flex-1 rounded border px-3 py-2 text-sm"
          placeholder="Ask about endpoints, params, auth, examples…"
        />
        <button onClick={onSend} className="rounded border px-3 py-2 text-sm">Send</button>
      </div>
    </div>
  );
}

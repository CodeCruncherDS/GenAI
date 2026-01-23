const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function ask(payload: { question: string; project: string }) {
  const r = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function ingest(payload: { project: string; file: File }) {
  const fd = new FormData();
  fd.append("project", payload.project);
  fd.append("file", payload.file);
  const r = await fetch(`${API_BASE}/api/ingest`, { method: "POST", body: fd });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

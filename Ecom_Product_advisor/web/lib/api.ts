const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function ingestCatalog(payload: { shop: string; file: File }) {
  const fd = new FormData();
  fd.append("shop", payload.shop);
  fd.append("file", payload.file);
  const r = await fetch(`${API_BASE}/api/ingest/catalog`, { method: "POST", body: fd });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function askAdvisor(payload: { question: string; shop: string }) {
  const r = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function compareSkus(payload: { shop: string; skus: string[] }) {
  const r = await fetch(`${API_BASE}/api/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

"use client";
import { useState } from "react";
import { ingestCatalog } from "@/lib/api";

export default function UploadCatalog() {
  const [shop, setShop] = useState("default");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function onUpload() {
    if (!file) return;
    setStatus("Uploading…");
    try {
      const res = await ingestCatalog({ shop, file });
      setStatus(`Indexed items=${res.indexed_items}, chunks=${res.indexed_chunks} into "${res.shop}"`);
    } catch (e: any) {
      setStatus(e?.message || "Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Catalog Ingestion</div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-neutral-600">Shop</label>
        <input value={shop} onChange={(e) => setShop(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm" />
        <input type="file" accept=".csv,.json" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
        <button onClick={onUpload} className="rounded border px-3 py-2 text-sm">Upload & Index</button>
      </div>
      {status && <div className="text-xs text-neutral-600">{status}</div>}
      <div className="text-xs text-neutral-500">
        CSV columns: sku,title,brand,category,price,currency,rating,in_stock,url,description,attr_*.
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { ingest } from "@/lib/api";

export default function UploadPanel() {
  const [project, setProject] = useState("default");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  async function onUpload() {
    if (!file) return;
    setStatus("Uploading…");
    try {
      const res = await ingest({ project, file });
      setStatus(`Indexed ${res.indexed_chunks} chunks into "${res.project}"`);
    } catch (e: any) {
      setStatus(e?.message || "Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Ingest API Docs</div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-neutral-600">Project</label>
        <input value={project} onChange={(e) => setProject(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm" />
      </div>
      <input type="file" accept=".json,.yaml,.yml,.md,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <button onClick={onUpload} className="rounded border px-3 py-2 text-sm">Upload & Index</button>
      {status && <div className="text-xs text-neutral-600">{status}</div>}
      <div className="text-xs text-neutral-500">Supported: OpenAPI JSON/YAML, Markdown, Text</div>
    </div>
  );
}

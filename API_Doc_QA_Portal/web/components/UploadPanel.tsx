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

      // Notify parent to update spec view
      const event = new CustomEvent("spec:upload", {
        detail: { project: res.project, filename: file.name }
      });
      window.dispatchEvent(event);

    } catch (e: any) {
      setStatus(e?.message || "Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">Ingest API Docs</div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-neutral-600">Project</label>
        <input value={project} onChange={(e) => setProject(e.target.value)} className="w-40 rounded border px-2 py-1 text-sm bg-neutral-50" />
      </div>
      <input type="file" accept=".json,.yaml,.yml,.md,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm" />
      <button onClick={onUpload} className="rounded bg-black px-3 py-2 text-sm text-white hover:bg-neutral-800 transition-colors">Upload & Index</button>
      {status && <div className="text-xs text-neutral-600 truncate">{status}</div>}
      {/* <div className="text-xs text-neutral-500">Supported: OpenAPI JSON/YAML, Markdown, Text</div> */}
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import Chat from "@/components/Chat";
import UploadPanel from "@/components/UploadPanel";
import Sources from "@/components/Sources";
import SpecPanel from "@/components/SpecPanel";

export default function Home() {
  const [project, setProject] = useState("default");
  const [specUrl, setSpecUrl] = useState("");

  // Listen for file uploads to update the spec view
  useEffect(() => {
    function onUpload(e: any) {
      const { project, filename } = e.detail;
      setProject(project);

      // Construct URL to fetch the raw spec from our new backend endpoint
      // We assume the backend is on localhost:8000 for now or use env var
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
      setSpecUrl(`${apiBase}/api/spec/${project}/${filename}`);
    }
    window.addEventListener("spec:upload", onUpload);
    return () => window.removeEventListener("spec:upload", onUpload);
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-[1600px] p-4 h-screen flex flex-col">
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between flex-shrink-0">
          <h1 className="text-xl font-semibold">API Documentation Q&A</h1>
          <div className="text-sm text-neutral-500">Upload OpenAPI → Ask → Get context</div>
        </header>

        <div className="flex-1 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_3fr] overflow-hidden">
          {/* Left Panel: Chat & Tools */}
          <div className="flex flex-col gap-4 overflow-hidden h-full">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 flex-shrink-0">
              <section className="rounded-lg border bg-white p-3 shadow-sm">
                <UploadPanel />
              </section>
            </div>
            <section className="flex-1 rounded-lg border bg-white p-3 shadow-sm overflow-hidden flex flex-col">
              <Chat />
            </section>
          </div>

          {/* Right Panel: Spec Visualization or Sources */}
          <div className="flex flex-col gap-4 overflow-hidden h-full">
            <div className="flex-1 rounded-lg border bg-white shadow-sm overflow-hidden relative">
              {specUrl ? (
                <SpecPanel url={specUrl} />
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-400">
                  Upload a file to see the Spec here
                </div>
              )}
            </div>
            <div className="h-1/3 rounded-lg border bg-white p-3 shadow-sm overflow-hidden">
              <Sources />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import Chat from "@/components/Chat";
import UploadPanel from "@/components/UploadPanel";
import Sources from "@/components/Sources";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4">
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">API Documentation Q&A</h1>
          <div className="text-sm text-neutral-500">Upload OpenAPI → Ask → Get context</div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <section className="rounded-lg border p-3">
            <Chat />
          </section>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-4">
            <div className="rounded-lg border p-3">
              <UploadPanel />
            </div>
            <div className="rounded-lg border p-3">
              <Sources />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

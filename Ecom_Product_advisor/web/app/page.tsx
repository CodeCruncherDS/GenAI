import Advisor from "@/components/Advisor";
import UploadCatalog from "@/components/UploadCatalog";
import CompareDrawer from "@/components/CompareDrawer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl p-4">
        <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">Product Advisor</h1>
          <div className="text-sm text-neutral-500">Upload catalog → Ask → Compare</div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
          <section className="flex flex-col gap-4">
            <div className="rounded-lg border p-3">
              <UploadCatalog />
            </div>
            <div className="rounded-lg border p-3">
              <Advisor />
            </div>
          </section>

          <aside className="lg:sticky lg:top-4">
            <CompareDrawer />
          </aside>
        </div>
      </div>
    </main>
  );
}

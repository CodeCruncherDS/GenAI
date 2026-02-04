import type { ReactNode } from "react";

export default function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-sand-200 bg-white/70 p-6 shadow-soft">
      <h2 className="text-lg font-display text-ink-900">{title}</h2>
      <div className="mt-4 space-y-4 text-ink-700">{children}</div>
    </section>
  );
}

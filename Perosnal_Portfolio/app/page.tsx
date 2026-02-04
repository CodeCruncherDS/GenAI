import Link from "next/link";
import Section from "@/components/Section";
import { getHomePageContent, getSiteData } from "@/lib/content-loader";

export default async function HomePage() {
  const site = await getSiteData();
  const home = await getHomePageContent();

  return (
    <>
      <section className="grid gap-6 rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-ink-500">{home.heroTag}</p>
          <h1 className="text-4xl font-display text-ink-900 md:text-5xl">{site.name}</h1>
          <p className="text-lg font-semibold text-ink-700">{site.title}</p>
          <p className="max-w-2xl text-base text-ink-600">{site.summary}</p>
          <p className="text-sm text-ink-500">{site.location}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-sand-200 bg-white px-4 py-2 text-ink-700 transition hover:border-accent-500 hover:text-accent-600"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title={home.focusTitle}>
          <p>{home.focusBody}</p>
        </Section>
        <Section title={home.currentlyTitle}>
          <ul className="list-disc space-y-2 pl-6 text-sm">
            {home.currentlyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}

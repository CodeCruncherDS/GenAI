import Link from "next/link";
import Section from "@/components/Section";
import { getProjectsPageContent } from "@/lib/content-loader";

export default async function ProjectsPage() {
  const content = await getProjectsPageContent();

  return (
    <>
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
        <p className="mt-3 text-ink-600">{content.intro}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title={content.professionalTitle}>
          <p className="text-sm">{content.professionalBlurb}</p>
          <Link
            href="/projects/professional"
            className="inline-flex w-fit rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-500 hover:text-accent-600"
          >
            {content.professionalCta}
          </Link>
        </Section>
        <Section title={content.personalTitle}>
          <p className="text-sm">{content.personalBlurb}</p>
          <Link
            href="/projects/personal"
            className="inline-flex w-fit rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-500 hover:text-accent-600"
          >
            {content.personalCta}
          </Link>
        </Section>
      </div>
    </>
  );
}

import Section from "@/components/Section";
import { getExperience, getExperiencePageContent } from "@/lib/content-loader";

export default async function ExperiencePage() {
  const [experience, content] = await Promise.all([getExperience(), getExperiencePageContent()]);

  return (
    <>
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
        <p className="mt-3 text-ink-600">{content.intro}</p>
      </section>

      <div className="grid gap-6">
        {experience.map((item) => (
          <Section key={`${item.company}-${item.role}`} title={`${item.role} · ${item.company}`}>
            <p className="text-sm text-ink-500">{item.time}</p>
            <p className="text-sm text-ink-500">{item.location}</p>
            <div>
              <p className="text-sm font-semibold text-ink-700">{content.responsibilitiesTitle}</p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-sm">
                {item.responsibilities.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-700">{content.ownershipTitle}</p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-sm">
                {item.ownership.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </Section>
        ))}
      </div>
    </>
  );
}

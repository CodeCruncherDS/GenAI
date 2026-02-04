import Section from "@/components/Section";
import { getSkills, getSkillsPageContent } from "@/lib/content-loader";

export default async function SkillsPage() {
  const [skills, content] = await Promise.all([getSkills(), getSkillsPageContent()]);

  return (
    <>
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
        <p className="mt-3 text-ink-600">{content.intro}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((group) => (
          <Section key={group.group} title={group.group}>
            <ul className="list-disc space-y-2 pl-6 text-sm">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        ))}
      </div>
    </>
  );
}

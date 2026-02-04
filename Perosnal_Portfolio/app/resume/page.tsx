import Section from "@/components/Section";
import { getResume, getResumePageContent } from "@/lib/content-loader";

export default async function ResumePage() {
  const [resume, content] = await Promise.all([getResume(), getResumePageContent()]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
            <p className="mt-3 text-ink-600">{content.intro}</p>
          </div>
          <a
            href="/resume.pdf"
            className="inline-flex w-fit rounded-full border border-sand-200 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:border-accent-500 hover:text-accent-600"
            download
          >
            {content.downloadLabel}
          </a>
        </div>
      </section>

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h2 className="text-xl font-display text-ink-900">{resume.name}</h2>
        <p className="text-sm text-ink-500">{resume.title}</p>
        <p className="mt-3 text-sm text-ink-600">{resume.summary}</p>
      </section>

      <Section title={content.contactTitle}>
        <ul className="text-sm text-ink-700">
          <li>{resume.contact.email}</li>
          <li>{resume.contact.location}</li>
          <li>{resume.contact.github}</li>
          <li>{resume.contact.linkedin}</li>
        </ul>
      </Section>

      <Section title={content.experienceTitle}>
        <div className="space-y-4">
          {resume.experience.map((item) => (
            <div key={`${item.company}-${item.role}`}>
              <p className="text-sm font-semibold text-ink-700">{item.role}</p>
              <p className="text-xs text-ink-500">{item.company} · {item.time}</p>
              <ul className="mt-2 list-disc space-y-2 pl-6 text-sm">
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title={content.educationTitle}>
        <div className="space-y-4">
          {resume.education.map((item) => (
            <div key={`${item.institution}-${item.degree}`}>
              <p className="text-sm font-semibold text-ink-700">{item.institution}</p>
              <p className="text-xs text-ink-500">{item.degree} · {item.time}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={content.skillsTitle}>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-sand-100 px-3 py-1 text-xs font-semibold text-ink-700">
              {skill}
            </span>
          ))}
        </div>
      </Section>
    </div>
  );
}

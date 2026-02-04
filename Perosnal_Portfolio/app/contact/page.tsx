import ContactForm from "@/components/ContactForm";
import Section from "@/components/Section";
import { getContactPageContent, getSiteData } from "@/lib/content-loader";

export default async function ContactPage() {
  const [site, content] = await Promise.all([getSiteData(), getContactPageContent()]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
        <p className="mt-3 text-ink-600">{content.intro}</p>

        <div className="mt-6 space-y-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-500">{content.emailLabel}</p>
            <a className="font-semibold text-accent-600" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-500">{content.githubLabel}</p>
            <a className="font-semibold text-accent-600" href={site.github}>
              {site.github}
            </a>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ink-500">{content.linkedinLabel}</p>
            <a className="font-semibold text-accent-600" href={site.linkedin}>
              {site.linkedin}
            </a>
          </div>
        </div>
      </section>

      <Section title={content.formTitle}>
        <p className="text-sm text-ink-600">{content.formDescription}</p>
        <ContactForm
          labels={{
            name: content.nameLabel,
            email: content.emailLabel,
            message: content.messageLabel,
            submit: content.submitLabel
          }}
        />
      </Section>
    </div>
  );
}

import { notFound } from "next/navigation";
import Badge from "@/components/Badge";
import Markdown from "@/components/Markdown";
import PersonalProjectDemo from "@/components/PersonalProjectDemo";
import { getDemos, getPersonalProject, getPersonalProjectPageContent } from "@/lib/content-loader";

export default async function PersonalProjectPage({ params }: { params: { slug: string } }) {
  const [project, content] = await Promise.all([
    getPersonalProject(params.slug),
    getPersonalProjectPageContent()
  ]);
  const demos = await getDemos();

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{project.name}</h1>
        <p className="mt-3 text-ink-600">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{content.timelineTitle}</p>
          <p className="mt-2 text-sm text-ink-700">{project.timeline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{content.roleTitle}</p>
          <p className="mt-2 text-sm text-ink-700">{project.role}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{content.stackTitle}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <Badge key={item} label={item} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-ink-500">{content.impactTitle}</p>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-sm text-ink-700">
            {project.impact.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h2 className="text-xl font-display text-ink-900">{content.readmeTitle}</h2>
        <div className="mt-4">
          <Markdown content={project.readme} />
        </div>
      </section>

      {project.diagram && (
        <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
          <h2 className="text-xl font-display text-ink-900">{content.architectureTitle}</h2>
          <div
            className="mt-4 rounded-2xl border border-sand-200 bg-sand-50 p-6"
            dangerouslySetInnerHTML={{ __html: project.diagram }}
          />
        </section>
      )}

      {project.interactiveDemo && (
        <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
          <h2 className="text-xl font-display text-ink-900">{content.demoTitle}</h2>
          <div className="mt-4">
            <PersonalProjectDemo
              demo={project.interactiveDemo}
              config={demos}
              fallbackMessage={content.noDemoMessage}
            />
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h2 className="text-xl font-display text-ink-900">{content.decisionLogTitle}</h2>
        <div className="mt-4">
          <Markdown content={project.decisions} />
        </div>
      </section>
    </div>
  );
}

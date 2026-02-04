import ProjectCard from "@/components/ProjectCard";
import { getProfessionalProjects, getProfessionalProjectsPageContent } from "@/lib/content-loader";

export default async function ProfessionalProjectsPage() {
  const [projects, content] = await Promise.all([getProfessionalProjects(), getProfessionalProjectsPageContent()]);

  return (
    <>
      <section className="rounded-3xl border border-sand-200 bg-white/80 p-8 shadow-soft">
        <h1 className="text-3xl font-display text-ink-900">{content.title}</h1>
        <p className="mt-3 text-ink-600">{content.intro}</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} href={`/projects/professional/${project.slug}`} />
        ))}
      </div>
    </>
  );
}

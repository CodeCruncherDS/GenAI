import Link from "next/link";
import Badge from "@/components/Badge";
import type { ProjectMeta } from "@/lib/types";

export default function ProjectCard({ project, href }: { project: ProjectMeta; href: string }) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col gap-4 rounded-2xl border border-sand-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div>
        <h3 className="text-lg font-display text-ink-900">{project.name}</h3>
        <p className="mt-2 text-sm text-ink-600">{project.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <Badge key={tag} label={tag} />
        ))}
      </div>
      <div className="text-xs text-ink-500">
        <span>{project.timeline}</span>
        <span className="mx-2">•</span>
        <span>{project.role}</span>
      </div>
    </Link>
  );
}

import { promises as fs } from "fs";
import path from "path";
import type {
  ExperienceItem,
  ExperiencePageContent,
  HomePageContent,
  PersonalProject,
  PersonalProjectPageContent,
  PersonalProjectsPageContent,
  ProfessionalProject,
  ProfessionalProjectPageContent,
  ProfessionalProjectsPageContent,
  ProjectMeta,
  ProjectsPageContent,
  Resume,
  ResumePageContent,
  SiteData,
  SkillGroup,
  SkillsPageContent,
  ToolGroup
} from "./types";
import type { ContactPageContent, DemoConfig, ToolsPageContent } from "./types";

const root = process.cwd();

function contentPath(...segments: string[]) {
  return path.join(root, "content", ...segments);
}

async function readJson<T>(filePath: string): Promise<T> {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data) as T;
}

async function readMarkdown(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf8");
}

async function readOptionalFile(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function getSiteData(): Promise<SiteData> {
  return readJson<SiteData>(contentPath("site.json"));
}

export async function getHomePageContent(): Promise<HomePageContent> {
  return readJson<HomePageContent>(contentPath("pages", "home.json"));
}

export async function getExperiencePageContent(): Promise<ExperiencePageContent> {
  return readJson<ExperiencePageContent>(contentPath("pages", "experience.json"));
}

export async function getProjectsPageContent(): Promise<ProjectsPageContent> {
  return readJson<ProjectsPageContent>(contentPath("pages", "projects.json"));
}

export async function getSkillsPageContent(): Promise<SkillsPageContent> {
  return readJson<SkillsPageContent>(contentPath("pages", "skills.json"));
}

export async function getToolsPageContent(): Promise<ToolsPageContent> {
  return readJson<ToolsPageContent>(contentPath("pages", "tools.json"));
}

export async function getResumePageContent(): Promise<ResumePageContent> {
  return readJson<ResumePageContent>(contentPath("pages", "resume.json"));
}

export async function getContactPageContent(): Promise<ContactPageContent> {
  return readJson<ContactPageContent>(contentPath("pages", "contact.json"));
}

export async function getProfessionalProjectsPageContent(): Promise<ProfessionalProjectsPageContent> {
  return readJson<ProfessionalProjectsPageContent>(contentPath("pages", "professional-projects.json"));
}

export async function getPersonalProjectsPageContent(): Promise<PersonalProjectsPageContent> {
  return readJson<PersonalProjectsPageContent>(contentPath("pages", "personal-projects.json"));
}

export async function getProfessionalProjectPageContent(): Promise<ProfessionalProjectPageContent> {
  return readJson<ProfessionalProjectPageContent>(contentPath("pages", "professional-project.json"));
}

export async function getPersonalProjectPageContent(): Promise<PersonalProjectPageContent> {
  return readJson<PersonalProjectPageContent>(contentPath("pages", "personal-project.json"));
}

export async function getDemos(): Promise<DemoConfig> {
  return readJson<DemoConfig>(contentPath("demos.json"));
}

export async function getExperience(): Promise<ExperienceItem[]> {
  return readJson<ExperienceItem[]>(contentPath("experience", "experience.json"));
}

export async function getSkills(): Promise<SkillGroup[]> {
  return readJson<SkillGroup[]>(contentPath("skills", "skills.json"));
}

export async function getTools(): Promise<ToolGroup[]> {
  return readJson<ToolGroup[]>(contentPath("tools", "tools.json"));
}

export async function getResume(): Promise<Resume> {
  return readJson<Resume>(contentPath("resume", "resume.json"));
}

export async function getProfessionalProjects(): Promise<ProfessionalProject[]> {
  const dir = contentPath("projects", "professional");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const projects = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const base = path.join(dir, entry.name);
        const meta = await readJson<ProjectMeta>(path.join(base, "meta.json"));
        const overview = await readMarkdown(path.join(base, "overview.md"));
        return { ...meta, slug: entry.name, overview };
      })
  );

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getProfessionalProject(slug: string): Promise<ProfessionalProject | null> {
  try {
    const base = contentPath("projects", "professional", slug);
    const meta = await readJson<ProjectMeta>(path.join(base, "meta.json"));
    const overview = await readMarkdown(path.join(base, "overview.md"));
    return { ...meta, slug, overview };
  } catch {
    return null;
  }
}

export async function getPersonalProjects(): Promise<ProjectMeta[]> {
  const dir = contentPath("projects", "personal");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const projects = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const base = path.join(dir, entry.name);
        const meta = await readJson<ProjectMeta>(path.join(base, "meta.json"));
        return { ...meta, slug: entry.name };
      })
  );

  return projects.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPersonalProject(slug: string): Promise<PersonalProject | null> {
  try {
    const base = contentPath("projects", "personal", slug);
    const meta = await readJson<ProjectMeta>(path.join(base, "meta.json"));
    const readme = await readMarkdown(path.join(base, "README.md"));
    const decisions = await readMarkdown(path.join(base, "decisions.md"));
    const diagram = await readOptionalFile(path.join(base, "diagram.svg"));
    return { ...meta, slug, readme, decisions, diagram };
  } catch {
    return null;
  }
}

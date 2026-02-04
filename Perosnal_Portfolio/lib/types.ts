export type NavItem = {
  label: string;
  href: string;
};

export type SiteData = {
  name: string;
  title: string;
  summary: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  nav: NavItem[];
  footerNote: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  time: string;
  location: string;
  responsibilities: string[];
  ownership: string[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type ToolGroup = {
  group: string;
  items: string[];
};

export type Resume = {
  name: string;
  title: string;
  summary: string;
  contact: {
    email: string;
    location: string;
    github: string;
    linkedin: string;
  };
  experience: {
    company: string;
    role: string;
    time: string;
    highlights: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    time: string;
  }[];
  skills: string[];
};

export type HomePageContent = {
  heroTag: string;
  focusTitle: string;
  focusBody: string;
  currentlyTitle: string;
  currentlyItems: string[];
};

export type ExperiencePageContent = {
  title: string;
  intro: string;
  responsibilitiesTitle: string;
  ownershipTitle: string;
};

export type ProjectsPageContent = {
  title: string;
  intro: string;
  professionalTitle: string;
  professionalBlurb: string;
  professionalCta: string;
  personalTitle: string;
  personalBlurb: string;
  personalCta: string;
};

export type SkillsPageContent = {
  title: string;
  intro: string;
};

export type ToolsPageContent = {
  title: string;
  intro: string;
};

export type ResumePageContent = {
  title: string;
  intro: string;
  downloadLabel: string;
  contactTitle: string;
  experienceTitle: string;
  educationTitle: string;
  skillsTitle: string;
};

export type ContactPageContent = {
  title: string;
  intro: string;
  emailLabel: string;
  githubLabel: string;
  linkedinLabel: string;
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  nameLabel: string;
  messageLabel: string;
  successMessage: string;
  errorMessage: string;
};

export type ProfessionalProjectsPageContent = {
  title: string;
  intro: string;
};

export type PersonalProjectsPageContent = {
  title: string;
  intro: string;
};

export type ProfessionalProjectPageContent = {
  overviewTitle: string;
  impactTitle: string;
  stackTitle: string;
  roleTitle: string;
  timelineTitle: string;
};

export type PersonalProjectPageContent = {
  readmeTitle: string;
  architectureTitle: string;
  demoTitle: string;
  decisionLogTitle: string;
  timelineTitle: string;
  roleTitle: string;
  stackTitle: string;
  impactTitle: string;
  noDemoMessage: string;
};

export type ProjectMeta = {
  slug: string;
  name: string;
  summary: string;
  tags: string[];
  timeline: string;
  role: string;
  stack: string[];
  impact: string[];
  interactiveDemo?: string;
};

export type ProfessionalProject = ProjectMeta & {
  overview: string;
};

export type PersonalProject = ProjectMeta & {
  readme: string;
  decisions: string;
  diagram?: string | null;
};

export type DemoConfig = {
  "signal-meter": {
    title: string;
    highLabel: string;
    balancedLabel: string;
    lowLabel: string;
    caption: string;
  };
  "decision-timer": {
    title: string;
    resetLabel: string;
    options: number[];
    caption: string;
  };
};

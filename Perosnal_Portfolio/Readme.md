# Professional Portfolio

A production-ready personal portfolio website built with Next.js (App Router), TypeScript, and Tailwind CSS. Designed to showcase professional experience, projects, and skills with clarity and high signal density.

## 🚀 Overview

This portfolio is architected as a static, content-driven application. All content (projects, experience, resume, etc.) is decoupled from the code and lives in a structured `content/` directory. This allows for easy updates without modifying the application logic.

**Key Features:**
*   **Performance:** Static generation (SSG) for lightning-fast load times.
*   **Type Safety:** Full TypeScript implementation with shared types for content.
*   **Styling:** Custom design system using Tailwind CSS variables.
*   **Content Management:** File-based content system (JSON & Markdown).
*   **SEO:** Semantic HTML and optimized metadata.
*   **Zero Dependencies:** No external CMS, databases, or authentication services.

## 🛠️ Tech Stack

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Markdown Rendering:** `marked` + `sanitize-html`
-   **Deployment:** Vercel

## 📂 Project Structure

```
├── app/                  # Next.js App Router pages and layouts
│   ├── contact/          # Contact page and server actions
│   ├── projects/         # Project index and detail pages
│   └── ...               # Other routes (experience, resume, etc.)
├── components/           # Reusable UI components
├── content/              # The "database" - all site content lives here
│   ├── projects/         # Project data (Professional & Personal)
│   ├── experience/       # Career history
│   └── ...               # Site metadata, skills, tools
├── lib/                  # Utilities
│   ├── content-loader.ts # Logic to read/parse JSON and Markdown files
│   └── markdown.ts       # Markdown configuration
└── public/               # Static assets (images, fonts)
```

## ⚡ Getting Started

### Prerequisites
-   Node.js 18.17 or later
-   npm or pnpm

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <repo-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:3000`.

## 📝 Content Management

To update your portfolio, you only need to modify files in the `content/` directory.

### Adding a New Project

**Professional Projects:**
1.  Create a folder in `content/projects/professional/<slug>`.
2.  Add `meta.json` with details (title, summary, tags, links).
3.  Add `overview.md` for the case study content.

**Personal Projects:**
1.  Create a folder in `content/projects/personal/<slug>`.
2.  Add `meta.json`.
3.  Add `README.md` (or copy from your actual project).
4.  Add `decisions.md` for the decision log.
5.  (Optional) Add `diagram.svg` for architecture visualization.

### Updating Resume
Edit `content/resume/resume.json`. This structured data renders the HTML resume.

## 🚢 Deployment (Vercel)

This project is optimized for Vercel's Free Tier.

1.  **Push to GitHub:** Ensure your code is committed to a GitHub repository.
2.  **Create Vercel Project:**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **"Add New..."** -> **"Project"**.
    *   Import your GitHub repository.
3.  **Configure Build:**
    *   Framework Preset: **Next.js** (default).
    *   Build Command: `next build` (default).
    *   Output Directory: `.next` (default).
4.  **Deploy:** Click **Deploy**.

**Note:** No environment variables are required for the base functionality.

## ⚠️ Common Pitfalls

-   **Markdown Images:** If referencing images in Markdown, ensure they exist in `public/` and use absolute paths (e.g., `/images/my-project/screenshot.png`).
-   **JSON Syntax:** Ensure strictly valid JSON in content files (no trailing commas).
-   **Slug Conflicts:** Folder names in `content/projects` become the URL slugs. Ensure they are unique.

## 🛡️ License

This project is open source and available under the [MIT License](LICENSE).
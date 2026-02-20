import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";

export type Skill = {
  slug: string;
  name: string;
  description: string;
  author: string;
  category: string;
  tags: string[];
  platform: string[];
  requires: string[];
  version: string;
  createdAt: string;
  readme: string;
  skillMd: string;
  installPrompt: string;
};

const SKILLS_DIR = path.join(process.cwd(), "skills");

function buildInstallPrompt(
  slug: string,
  files: { name: string; content: string }[]
): string {
  const fileBlocks = files
    .map(
      (f) =>
        `--- File: .claude/skills/${slug}/${f.name} ---\n${f.content}`
    )
    .join("\n\n");

  return `Please install this Claude Code skill by creating the following files:\n\n${fileBlocks}`;
}

export function getAllSkills(): Skill[] {
  const slugs = fs.readdirSync(SKILLS_DIR).filter((f) =>
    fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
  );

  return slugs
    .map((slug) => {
      const dir = path.join(SKILLS_DIR, slug);

      // Read meta.json
      const metaPath = path.join(dir, "meta.json");
      if (!fs.existsSync(metaPath)) return null;
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // Read README.md
      const readmePath = path.join(dir, "README.md");
      const readme = fs.existsSync(readmePath)
        ? fs.readFileSync(readmePath, "utf-8")
        : "";

      // Read SKILL.md
      const skillPath = path.join(dir, "SKILL.md");
      const skillMd = fs.existsSync(skillPath)
        ? fs.readFileSync(skillPath, "utf-8")
        : "";

      // Read all .md files (except README.md) to build install prompt
      const allFiles = fs.readdirSync(dir);
      const skillFiles = allFiles
        .filter((f) => f.endsWith(".md") && f !== "README.md")
        .sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)))
        .map((f) => ({
          name: f,
          content: fs.readFileSync(path.join(dir, f), "utf-8"),
        }));

      const installPrompt = buildInstallPrompt(slug, skillFiles);

      return { slug, ...meta, readme, skillMd, installPrompt } as Skill;
    })
    .filter(Boolean) as Skill[];
}

export function getSkillBySlug(slug: string): Skill | null {
  const skills = getAllSkills();
  return skills.find((s) => s.slug === slug) ?? null;
}

export function getAllCategories(): string[] {
  const skills = getAllSkills();
  return [...new Set(skills.map((s) => s.category))].sort();
}

export function getAllTags(): string[] {
  const skills = getAllSkills();
  return [...new Set(skills.flatMap((s) => s.tags))].sort();
}

export function getContributorCount(): number {
  const skills = getAllSkills();
  return new Set(skills.map((s) => s.author)).size;
}

export async function parseMarkdown(md: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(md);
  return result.toString();
}

export type ReadmeSection = {
  title: string;
  html: string;
};

export async function parseReadmeSections(
  md: string
): Promise<ReadmeSection[]> {
  const lines = md.split("\n");
  const sections: { title: string; content: string }[] = [];
  let currentTitle = "";
  let currentLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentLines.join("\n") });
      }
      currentTitle = match[1].trim();
      currentLines = [];
    } else if (currentTitle) {
      currentLines.push(line);
    }
    // Skip lines before the first ## heading (e.g. the # title)
  }

  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentLines.join("\n") });
  }

  const parsed: ReadmeSection[] = [];
  for (const section of sections) {
    const html = await parseMarkdown(section.content.trim());
    parsed.push({ title: section.title, html });
  }

  return parsed;
}

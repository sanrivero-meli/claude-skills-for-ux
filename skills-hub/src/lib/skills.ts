import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { Redis } from "@upstash/redis";

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

type SkillMeta = Omit<Skill, "slug" | "readme" | "skillMd" | "installPrompt">;

const SKILLS_DIR = path.join(process.cwd(), "skills");

function getKv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

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

export async function getAllSkills(): Promise<Skill[]> {
  const slugs = fs.readdirSync(SKILLS_DIR).filter((f) =>
    fs.statSync(path.join(SKILLS_DIR, f)).isDirectory()
  );

  // Batch-fetch all KV overrides
  const kv = getKv();
  const overrides = new Map<string, Partial<SkillMeta>>();
  if (kv) {
    try {
      const keys = slugs.map((s) => `skill:${s}:meta`);
      const values = await kv.mget<(Partial<SkillMeta> | null)[]>(...keys);
      slugs.forEach((slug, i) => {
        if (values[i]) overrides.set(slug, values[i]);
      });
    } catch {
      // KV unavailable — fall back to filesystem only
    }
  }

  return slugs
    .map((slug) => {
      const dir = path.join(SKILLS_DIR, slug);

      const metaPath = path.join(dir, "meta.json");
      if (!fs.existsSync(metaPath)) return null;
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

      // Merge KV overrides on top of filesystem meta
      const kvMeta = overrides.get(slug);
      const merged = kvMeta ? { ...meta, ...kvMeta } : meta;

      const readmePath = path.join(dir, "README.md");
      const readme = fs.existsSync(readmePath)
        ? fs.readFileSync(readmePath, "utf-8")
        : "";

      const skillPath = path.join(dir, "SKILL.md");
      const skillMd = fs.existsSync(skillPath)
        ? fs.readFileSync(skillPath, "utf-8")
        : "";

      const allFiles = fs.readdirSync(dir);
      const skillFiles = allFiles
        .filter((f) => f.endsWith(".md") && f !== "README.md")
        .sort((a, b) => (a === "SKILL.md" ? -1 : b === "SKILL.md" ? 1 : a.localeCompare(b)))
        .map((f) => ({
          name: f,
          content: fs.readFileSync(path.join(dir, f), "utf-8"),
        }));

      const installPrompt = buildInstallPrompt(slug, skillFiles);

      return { slug, ...merged, readme, skillMd, installPrompt } as Skill;
    })
    .filter(Boolean) as Skill[];
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  const skills = await getAllSkills();
  return skills.find((s) => s.slug === slug) ?? null;
}

export async function getAllCategories(): Promise<string[]> {
  const skills = await getAllSkills();
  return [...new Set(skills.map((s) => s.category))].sort();
}

export async function getAllTags(): Promise<string[]> {
  const skills = await getAllSkills();
  return [...new Set(skills.flatMap((s) => s.tags))].sort();
}

export async function getContributorCount(): Promise<number> {
  const skills = await getAllSkills();
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

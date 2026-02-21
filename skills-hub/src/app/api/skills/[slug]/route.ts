import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SKILLS_DIR = path.join(process.cwd(), "skills");

async function commitToGitHub(
  filePath: string,
  content: string
): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) {
    throw new Error("GitHub integration not configured");
  }

  const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  // Get current file SHA (required for updates)
  const getRes = await fetch(apiUrl, { headers });
  if (!getRes.ok) {
    throw new Error(`GitHub API error: ${getRes.status}`);
  }
  const { sha } = await getRes.json();

  // Commit the updated file
  const putRes = await fetch(apiUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Update ${filePath.split("/").pop()} via Skills Hub`,
      content: Buffer.from(content).toString("base64"),
      sha,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`GitHub commit failed: ${err}`);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  const metaPath = path.join(SKILLS_DIR, slug, "meta.json");
  if (!fs.existsSync(metaPath)) {
    return NextResponse.json({ error: "Skill not found" }, { status: 404 });
  }

  try {
    const currentMeta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const updates = await request.json();

    const allowedFields = [
      "name",
      "description",
      "author",
      "category",
      "tags",
      "platform",
      "requires",
      "version",
    ];

    const newMeta = { ...currentMeta };
    for (const field of allowedFields) {
      if (field in updates) {
        newMeta[field] = updates[field];
      }
    }

    const newContent = JSON.stringify(newMeta, null, 2) + "\n";
    const repoFilePath = `skills-hub/skills/${slug}/meta.json`;

    await commitToGitHub(repoFilePath, newContent);

    return NextResponse.json({ ok: true, meta: newMeta });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SKILLS_DIR = path.join(process.cwd(), "skills");

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

    fs.writeFileSync(metaPath, JSON.stringify(newMeta, null, 2) + "\n");

    return NextResponse.json({ ok: true, meta: newMeta });
  } catch {
    return NextResponse.json(
      { error: "Cannot save — filesystem is read-only in production. Edit meta.json in the repo instead." },
      { status: 500 }
    );
  }
}

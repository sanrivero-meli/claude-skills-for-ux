import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";

const SKILLS_DIR = path.join(process.cwd(), "skills");

function getKv() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return Redis.fromEnv();
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

    const kv = getKv();
    if (kv) {
      await kv.set(`skill:${slug}:meta`, newMeta);
    } else {
      return NextResponse.json(
        { error: "Redis not configured — set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, meta: newMeta });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

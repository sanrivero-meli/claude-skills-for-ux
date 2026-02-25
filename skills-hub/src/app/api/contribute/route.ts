import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

function getKv() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const CONTRIB_PREFIX = "contrib:";

export async function POST(request: NextRequest) {
  try {
    const { name, description, body, raw } = await request.json();

    if (!name || !description || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const kv = getKv();
    if (!kv) {
      return NextResponse.json(
        { error: "Storage not configured" },
        { status: 500 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const key = `${CONTRIB_PREFIX}${Date.now()}:${slug}`;

    await kv.set(key, {
      name,
      description,
      body,
      raw,
      submittedAt: new Date().toISOString(),
      status: "pending",
    });

    return NextResponse.json({ ok: true, id: key });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kv = getKv();
  if (!kv) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 500 }
    );
  }

  try {
    const keys: string[] = [];
    let cursor = 0;
    do {
      const [nextCursor, batch] = await kv.scan(cursor, {
        match: `${CONTRIB_PREFIX}*`,
        count: 100,
      });
      cursor = nextCursor as unknown as number;
      keys.push(...(batch as string[]));
    } while (cursor !== 0);

    type ContribData = {
      name: string;
      description: string;
      body: string;
      raw: string;
      submittedAt: string;
      status: string;
    };

    const contributions = await Promise.all(
      keys.map(async (key) => {
        const data = (await kv.get(key)) as ContribData;
        return { key, ...data };
      })
    );

    contributions.sort(
      (a, b) =>
        new Date(b.submittedAt).getTime() -
        new Date(a.submittedAt).getTime()
    );

    return NextResponse.json({ contributions });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await request.json();
  if (!key || !key.startsWith(CONTRIB_PREFIX)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  const kv = getKv();
  if (!kv) {
    return NextResponse.json(
      { error: "Storage not configured" },
      { status: 500 }
    );
  }

  try {
    await kv.del(key);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

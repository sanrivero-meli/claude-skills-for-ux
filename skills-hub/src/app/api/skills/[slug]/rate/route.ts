import { NextRequest, NextResponse } from "next/server";
import {
  submitRating,
  ALL_SENIORITY_LEVELS,
  type SeniorityLevel,
} from "@/lib/ratings";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let body: { name?: string; seniority?: string; score?: number; comment?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, seniority, score, comment } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  if (!seniority || !ALL_SENIORITY_LEVELS.includes(seniority as SeniorityLevel)) {
    return NextResponse.json(
      { error: "Invalid seniority level" },
      { status: 400 }
    );
  }

  if (!score || typeof score !== "number" || score < 1 || score > 5 || !Number.isInteger(score)) {
    return NextResponse.json(
      { error: "Score must be an integer between 1 and 5" },
      { status: 400 }
    );
  }

  try {
    const ratings = await submitRating(
      slug,
      name.trim(),
      seniority as SeniorityLevel,
      score,
      comment
    );

    if (!ratings) {
      return NextResponse.json(
        { error: "Rating service unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, ratings });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit rating";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

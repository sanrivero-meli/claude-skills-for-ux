import { Redis } from "@upstash/redis";

// --- Types ---

export type RatingBucket = "user" | "curator";

export type SeniorityLevel =
  | "Junior"
  | "Semisenior"
  | "Senior"
  | "Lead"
  | "Manager"
  | "Expert"
  | "Technical Lead"
  | "Senior Manager"
  | "Director";

export type AggScore = {
  sum: number;
  count: number;
  avg: number;
};

export type SkillRatings = {
  curator: AggScore;
  user: AggScore;
};

export type Tier = "gold" | "silver" | "bronze";

export type Rating = {
  name: string;
  seniority: SeniorityLevel;
  score: number;
  bucket: RatingBucket;
  comment?: string;
  createdAt: string;
};

// --- Constants ---

export const SENIORITY_LEVELS: Record<RatingBucket, SeniorityLevel[]> = {
  user: ["Junior", "Semisenior", "Senior"],
  curator: ["Lead", "Technical Lead", "Manager", "Expert", "Senior Manager", "Director"],
};

export const ALL_SENIORITY_LEVELS: SeniorityLevel[] = [
  ...SENIORITY_LEVELS.user,
  ...SENIORITY_LEVELS.curator,
];

const TIER_THRESHOLDS: { tier: Tier; minAvg: number; minCount: number }[] = [
  { tier: "gold", minAvg: 4.5, minCount: 5 },
  { tier: "silver", minAvg: 3.5, minCount: 3 },
  { tier: "bronze", minAvg: 3.0, minCount: 2 },
];

const EMPTY_AGG: AggScore = { sum: 0, count: 0, avg: 0 };

// --- Helpers ---

function getKv(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function getBucket(seniority: SeniorityLevel): RatingBucket {
  if (SENIORITY_LEVELS.curator.includes(seniority)) return "curator";
  return "user";
}

export function computeTier(ratings: SkillRatings): Tier | null {
  const { curator, user } = ratings;
  for (const { tier, minAvg, minCount } of TIER_THRESHOLDS) {
    if (
      curator.count >= minCount &&
      user.count >= minCount &&
      curator.avg >= minAvg &&
      user.avg >= minAvg
    ) {
      return tier;
    }
  }
  return null;
}

// --- Redis Operations ---

export async function submitRating(
  slug: string,
  name: string,
  seniority: SeniorityLevel,
  score: number,
  comment?: string
): Promise<SkillRatings | null> {
  const kv = getKv();
  if (!kv) return null;

  const bucket = getBucket(seniority);
  const nameSlug = name.toLowerCase().replace(/\s+/g, "-");
  const ratingKey = `rating:${slug}:${nameSlug}`;

  // Check for existing rating by same person on same skill
  const existing = await kv.get<Rating>(ratingKey);

  // Store the individual rating (overwrites previous by same name)
  const rating: Rating = {
    name,
    seniority,
    score,
    bucket,
    ...(comment?.trim() ? { comment: comment.trim() } : {}),
    createdAt: new Date().toISOString(),
  };
  await kv.set(ratingKey, rating);

  // Update per-skill aggregate
  const aggKey = `ratings:${slug}:agg`;
  const currentAgg = await kv.get<SkillRatings>(aggKey);
  const agg: SkillRatings = currentAgg ?? {
    curator: { ...EMPTY_AGG },
    user: { ...EMPTY_AGG },
  };

  // If overwriting, subtract old score first
  if (existing) {
    const oldBucket = existing.bucket;
    agg[oldBucket].sum -= existing.score;
    agg[oldBucket].count -= 1;
    if (agg[oldBucket].count > 0) {
      agg[oldBucket].avg = agg[oldBucket].sum / agg[oldBucket].count;
    } else {
      agg[oldBucket].avg = 0;
    }
  }

  // Add new score
  agg[bucket].sum += score;
  agg[bucket].count += 1;
  agg[bucket].avg = agg[bucket].sum / agg[bucket].count;

  await kv.set(aggKey, agg);

  // Update global aggregates hash for batch loading
  const allAgg = (await kv.get<Record<string, SkillRatings>>("ratings:all-agg")) ?? {};
  allAgg[slug] = agg;
  await kv.set("ratings:all-agg", allAgg);

  return agg;
}

export async function getSkillRatings(slug: string): Promise<SkillRatings> {
  const kv = getKv();
  if (!kv) return { curator: { ...EMPTY_AGG }, user: { ...EMPTY_AGG } };

  const agg = await kv.get<SkillRatings>(`ratings:${slug}:agg`);
  return agg ?? { curator: { ...EMPTY_AGG }, user: { ...EMPTY_AGG } };
}

export async function getAllRatings(): Promise<Record<string, SkillRatings>> {
  const kv = getKv();
  if (!kv) return {};

  const allAgg = await kv.get<Record<string, SkillRatings>>("ratings:all-agg");
  return allAgg ?? {};
}

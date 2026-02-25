"use client";

import { StarRating } from "@/components/StarRating";
import { TierBadge } from "@/components/TierBadge";
import { computeTier, type SkillRatings } from "@/lib/ratings";
import { useTranslation } from "@/i18n/context";

type RatingDisplayProps = {
  ratings: SkillRatings;
  variant?: "compact" | "full";
};

function ScoreBlock({
  label,
  avg,
  count,
  variant,
}: {
  label: string;
  avg: number;
  count: number;
  variant: "compact" | "full";
}) {
  const { t } = useTranslation();
  const reviewLabel =
    count === 1 ? t("rating.review") : t("rating.reviews");

  if (count === 0) {
    return (
      <div className={variant === "compact" ? "flex items-center gap-1" : ""}>
        <span className="text-zinc-600 text-xs">
          {label}: —
        </span>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-zinc-500 text-[10px] uppercase tracking-wide">
          {label}
        </span>
        <span className="text-zinc-200 text-sm font-medium tabular-nums">
          {avg.toFixed(1)}
        </span>
        <StarRating value={Math.round(avg)} readonly size={10} />
        <span className="text-zinc-600 text-[10px]">({count})</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <span className="text-zinc-500 text-xs uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-zinc-50 text-2xl font-semibold tabular-nums">
          {avg.toFixed(1)}
        </span>
        <div>
          <StarRating value={Math.round(avg)} readonly size={16} />
          <span className="text-zinc-500 text-xs block">
            {count} {reviewLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export function RatingDisplay({
  ratings,
  variant = "compact",
}: RatingDisplayProps) {
  const { t } = useTranslation();
  const tier = computeTier(ratings);

  const curatorLabel = t("rating.curatorScore");
  const userLabel = t("rating.userScore");

  const hasAny = ratings.curator.count > 0 || ratings.user.count > 0;

  if (!hasAny && variant === "compact") {
    return null;
  }

  if (!hasAny) {
    return (
      <p className="text-zinc-600 text-sm">
        {t("rating.noRatings")}
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3 mt-2 flex-wrap">
        {tier && <TierBadge tier={tier} small />}
        <ScoreBlock
          label={curatorLabel}
          avg={ratings.curator.avg}
          count={ratings.curator.count}
          variant="compact"
        />
        <ScoreBlock
          label={userLabel}
          avg={ratings.user.avg}
          count={ratings.user.count}
          variant="compact"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tier && <TierBadge tier={tier} />}
      <div className="grid grid-cols-2 gap-6">
        <ScoreBlock
          label={curatorLabel}
          avg={ratings.curator.avg}
          count={ratings.curator.count}
          variant="full"
        />
        <ScoreBlock
          label={userLabel}
          avg={ratings.user.avg}
          count={ratings.user.count}
          variant="full"
        />
      </div>
    </div>
  );
}

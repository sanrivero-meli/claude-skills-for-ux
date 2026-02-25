"use client";

import type { Tier } from "@/lib/ratings";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/types";

const TIER_STYLES: Record<Tier, string> = {
  gold: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  silver: "bg-zinc-300/15 text-zinc-300 border-zinc-400/30",
  bronze: "bg-orange-400/15 text-orange-300 border-orange-400/30",
};

type TierBadgeProps = {
  tier: Tier;
  small?: boolean;
};

export function TierBadge({ tier, small = false }: TierBadgeProps) {
  const { t } = useTranslation();

  const label = t(`tier.${tier}` as TranslationKey);

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${TIER_STYLES[tier]} ${
        small ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5"
      }`}
    >
      <span
        className={`rounded-full ${
          small ? "w-1.5 h-1.5" : "w-2 h-2"
        } ${
          tier === "gold"
            ? "bg-amber-400"
            : tier === "silver"
              ? "bg-zinc-300"
              : "bg-orange-400"
        }`}
      />
      {label}
    </span>
  );
}

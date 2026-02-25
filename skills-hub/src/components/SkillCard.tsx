"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/skills";
import { RatingDisplay } from "@/components/RatingDisplay";
import { useTranslation } from "@/i18n/context";
import { slugifyCategory } from "@/i18n/utils";
import type { TranslationKey } from "@/i18n/types";

export function SkillCard({ skill }: { skill: Skill }) {
  const { tContent } = useTranslation();

  const name = tContent(`skill.${skill.slug}.name` as TranslationKey, skill.name);
  const description = tContent(`skill.${skill.slug}.description` as TranslationKey, skill.description);
  const category = tContent(`category.${slugifyCategory(skill.category)}` as TranslationKey, skill.category);

  return (
    <Link href={`/skills/${skill.slug}`}>
      <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary">{category}</Badge>
          <span className="text-zinc-600 text-xs">{skill.author}</span>
        </div>
        <h3 className="font-medium text-zinc-50 mb-1 group-hover:text-white">
          {name}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {description.length > 100
            ? description.slice(0, 100).trimEnd() + "..."
            : description}
        </p>
        {skill.ratings && (
          <RatingDisplay ratings={skill.ratings} variant="compact" />
        )}
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SkillGrid } from "@/components/SkillGrid";
import { LanguageToggle } from "@/i18n/language-toggle";
import { useTranslation } from "@/i18n/context";
import type { Skill } from "@/lib/skills";

export function HomeContent({
  skills,
  categories,
  contributorCount,
}: {
  skills: Skill[];
  categories: string[];
  contributorCount: number;
}) {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 max-w-5xl mx-auto text-left">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs tracking-widest text-zinc-500 uppercase">
            UX FINTECH
          </p>
          <LanguageToggle />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          {t("home.title")}
        </h1>
        <p className="text-zinc-400 text-lg mb-6 max-w-xl">
          {t("home.subtitle")}
        </p>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1">
            {t("home.skillCount", { count: skills.length })}
          </span>
          <span className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1">
            {contributorCount}{" "}
            {contributorCount === 1
              ? t("common.contributor")
              : t("common.contributors")}
          </span>
        </div>
      </section>

      {/* Browse */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <SkillGrid skills={skills} categories={categories} />
      </section>

      {/* Contribute CTA */}
      <section className="px-6 pb-24 max-w-5xl mx-auto text-center">
        <div className="border border-zinc-800 rounded-2xl bg-zinc-900/50 py-12 px-6">
          <h2 className="text-xl font-semibold tracking-tight mb-2">
            {t("home.ctaTitle")}
          </h2>
          <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
            {t("home.ctaDescription")}
          </p>
          <Link href="/contribute">
            <Button size="lg">{t("home.ctaButton")}</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/StarRating";
import { RatingDisplay } from "@/components/RatingDisplay";
import { ALL_SENIORITY_LEVELS, type SkillRatings, type SeniorityLevel } from "@/lib/ratings";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/types";
import { ChevronDown, Star } from "lucide-react";

type RatingFormProps = {
  slug: string;
  initialRatings: SkillRatings;
};

export function RatingForm({ slug, initialRatings }: RatingFormProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [seniority, setSeniority] = useState<SeniorityLevel | "">("");
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratings, setRatings] = useState<SkillRatings>(initialRatings);
  const [success, setSuccess] = useState(false);

  const seniorityLabel = (level: SeniorityLevel) =>
    t(`seniority.${level.toLowerCase().replace(/\s+/g, "")}` as TranslationKey);

  const handleSubmit = async () => {
    if (!name.trim() || !seniority || score === 0) return;

    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/skills/${slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), seniority, score, ...(comment.trim() ? { comment: comment.trim() } : {}) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("rating.error"));
      }

      const data = await res.json();
      setRatings(data.ratings);
      setSuccess(true);
      setName("");
      setSeniority("");
      setScore(0);
      setComment("");

      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("rating.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = name.trim() && seniority && score > 0 && !submitting;

  return (
    <div className="space-y-4">
      <RatingDisplay ratings={ratings} variant="full" />

      {!open ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="gap-1.5"
        >
          <Star size={14} />
          {t("rating.rateSkill")}
        </Button>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          {/* Name */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              {t("rating.name")}
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("rating.name")}
              className="h-8 text-sm"
            />
          </div>

          {/* Seniority dropdown */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              {t("rating.seniority")}
            </label>
            <div className="relative">
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as SeniorityLevel)}
                className="w-full h-8 rounded-md border border-zinc-700 bg-zinc-900 px-3 pr-8 text-sm text-zinc-300 appearance-none focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50"
              >
                <option value="" disabled>
                  {t("rating.selectSeniority")}
                </option>
                {ALL_SENIORITY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {seniorityLabel(level)}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
              />
            </div>
          </div>

          {/* Star rating */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              {t("rating.score")}
            </label>
            <StarRating value={score} onChange={setScore} size={22} />
          </div>

          {/* Comment */}
          <div>
            <label className="text-xs text-zinc-500 block mb-1">
              {t("rating.comment")}
              <span className="text-zinc-700 ml-1">
                ({t("rating.optional")})
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("rating.commentPlaceholder")}
              maxLength={500}
              rows={2}
              className="w-full rounded-md border border-zinc-700 bg-transparent px-3 py-2 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/50 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? t("rating.submitting") : t("rating.submit")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOpen(false);
                setError(null);
                setSuccess(false);
              }}
              disabled={submitting}
            >
              {t("meta.cancel")}
            </Button>
            {error && (
              <span className="text-red-400 text-xs">{error}</span>
            )}
            {success && (
              <span className="text-emerald-400 text-xs">
                {t("rating.success")}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

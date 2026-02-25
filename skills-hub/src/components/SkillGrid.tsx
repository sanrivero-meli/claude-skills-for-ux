"use client";

import { useState, useRef, useEffect } from "react";
import { Skill } from "@/lib/skills";
import { SkillCard } from "./SkillCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { slugifyCategory } from "@/i18n/utils";
import type { TranslationKey } from "@/i18n/types";

export function SkillGrid({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: string[];
}) {
  const { t, tContent } = useTranslation();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (searchAreaRef.current && !searchAreaRef.current.contains(e.target as Node)) {
        setQuery("");
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  const toggleSearch = () => {
    if (searchOpen) {
      setQuery("");
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  const filtered = skills.filter((s) => {
    const translatedName = tContent(`skill.${s.slug}.name` as TranslationKey, s.name);
    const translatedDesc = tContent(`skill.${s.slug}.description` as TranslationKey, s.description);
    const q = query.toLowerCase();
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      translatedName.toLowerCase().includes(q) ||
      translatedDesc.toLowerCase().includes(q);
    const matchesCategory =
      !activeCategory || s.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      {/* Category filters + search */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
            !activeCategory
              ? "border-zinc-400 text-zinc-50 bg-zinc-800"
              : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
          }`}
        >
          {t("grid.all")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setActiveCategory(activeCategory === cat ? null : cat)
            }
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
              activeCategory === cat
                ? "border-zinc-400 text-zinc-50 bg-zinc-800"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
            }`}
          >
            {tContent(`category.${slugifyCategory(cat)}` as TranslationKey, cat)}
          </button>
        ))}

        <div ref={searchAreaRef} className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleSearch}
            className={`text-xs px-3 rounded-full border transition-colors flex items-center justify-center h-[30px] ${
              searchOpen
                ? "border-zinc-400 text-zinc-50 bg-zinc-800"
                : "border-zinc-700 text-zinc-500 hover:border-zinc-500"
            }`}
          >
            <Search size={14} />
          </button>

          {searchOpen && (
            <Input
              ref={inputRef}
              placeholder={t("grid.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-7 text-xs w-48"
            />
          )}
        </div>

      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm">{t("grid.noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      )}

    </div>
  );
}

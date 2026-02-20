"use client";

import { useState, useRef, useEffect } from "react";
import { Skill } from "@/lib/skills";
import { SkillCard } from "./SkillCard";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

export function SkillGrid({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: string[];
}) {
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
    const matchesQuery =
      !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase());
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
          All
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
            {cat}
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
              placeholder="Search skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-7 text-xs w-48"
            />
          )}
        </div>

      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-sm">No skills match your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      )}

      {/* Add skill */}
      <Link
        href="/contribute"
        className="mt-4 flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-400 transition-colors py-3"
      >
        <Plus size={14} />
        Add a skill
      </Link>
    </div>
  );
}

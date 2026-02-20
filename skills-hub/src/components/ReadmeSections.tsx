"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReadmeSection } from "@/lib/skills";

export function ReadmeSections({ sections }: { sections: ReadmeSection[] }) {
  const [expanded, setExpanded] = useState(false);

  if (sections.length === 0) return null;

  return (
    <div className="mt-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        <ChevronDown
          size={14}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
        {expanded ? "Show less" : "Read more"}
      </button>

      {expanded && (
        <div className="mt-6 space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                {section.title}
              </h3>
              <div
                className="prose prose-invert prose-zinc prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: section.html }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

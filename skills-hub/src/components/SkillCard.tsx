import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/skills";

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <div className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-600 transition-colors cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <Badge variant="secondary">{skill.category}</Badge>
          <span className="text-zinc-600 text-xs">{skill.author}</span>
        </div>
        <h3 className="font-medium text-zinc-50 mb-1 group-hover:text-white">
          {skill.name}
        </h3>
        <p className="text-zinc-400 text-sm leading-relaxed">
          {skill.description.length > 100
            ? skill.description.slice(0, 100).trimEnd() + "..."
            : skill.description}
        </p>
      </div>
    </Link>
  );
}

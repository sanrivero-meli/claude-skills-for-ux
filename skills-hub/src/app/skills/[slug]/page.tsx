import Link from "next/link";
import { getAllSkills, getSkillBySlug, parseReadmeSections } from "@/lib/skills";
import { notFound } from "next/navigation";
import { InstallSnippet } from "@/components/InstallSnippet";
import { EditableSkillMeta } from "@/components/EditableSkillMeta";
import { AdminLoginButton } from "@/components/AdminLoginButton";
import { ReadmeSections } from "@/components/ReadmeSections";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const sections = skill.readme
    ? await parseReadmeSections(skill.readme)
    : [];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <AdminLoginButton />
        </div>

        {/* Editable metadata + expandable README sections */}
        <EditableSkillMeta skill={skill} />
        <ReadmeSections sections={sections} />

        {/* Install */}
        <div className="mt-8">
          <InstallSnippet
            installPrompt={skill.installPrompt}
          />
        </div>
      </div>
    </main>
  );
}

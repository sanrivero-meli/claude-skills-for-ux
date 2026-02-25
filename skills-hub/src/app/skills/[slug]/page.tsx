import { getAllSkills, getSkillBySlug, parseReadmeSections } from "@/lib/skills";
import { getSkillRatings } from "@/lib/ratings";
import { notFound } from "next/navigation";
import { InstallSnippet } from "@/components/InstallSnippet";
import { EditableSkillMeta } from "@/components/EditableSkillMeta";
import { RatingForm } from "@/components/RatingForm";
import { AdminLoginButton } from "@/components/AdminLoginButton";
import { ReadmeSections } from "@/components/ReadmeSections";
import { BackLink } from "@/components/BackLink";

export async function generateStaticParams() {
  const skills = await getAllSkills();
  return skills.map((s) => ({ slug: s.slug }));
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  if (!skill) notFound();

  const sections = skill.readme
    ? await parseReadmeSections(skill.readme)
    : [];

  const ratings = await getSkillRatings(slug);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 px-6 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <BackLink />
          <AdminLoginButton />
        </div>

        {/* Editable metadata + expandable README sections */}
        <EditableSkillMeta skill={skill} />

        {/* Rating section */}
        <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
          <RatingForm slug={slug} initialRatings={ratings} />
        </div>

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

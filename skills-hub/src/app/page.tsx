import { getAllSkills, getAllCategories, getContributorCount } from "@/lib/skills";
import { SkillGrid } from "@/components/SkillGrid";

export default async function Home() {
  const skills = await getAllSkills();
  const categories = await getAllCategories();
  const contributors = await getContributorCount();

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Hero */}
      <section className="px-6 pt-24 pb-16 max-w-5xl mx-auto text-left">
        <p className="text-xs tracking-widest text-zinc-500 uppercase mb-4">
          UX FINTECH
        </p>
        <h1 className="text-4xl font-semibold tracking-tight mb-4">
          Claude Skills for Designers
        </h1>
        <p className="text-zinc-400 text-lg mb-6 max-w-xl">
          Install-ready skills to work better, faster and achieve world class
          results. Built by the team, for the team.
        </p>
        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1">
            {skills.length} skills
          </span>
          <span className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-3 py-1">
            {contributors} {contributors === 1 ? "contributor" : "contributors"}
          </span>
        </div>
      </section>

      {/* Browse */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <SkillGrid skills={skills} categories={categories} />
      </section>
    </main>
  );
}

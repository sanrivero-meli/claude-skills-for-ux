import { getAllSkills, getAllCategories, getContributorCount } from "@/lib/skills";
import { HomeContent } from "@/components/HomeContent";

export default async function Home() {
  const skills = await getAllSkills();
  const categories = await getAllCategories();
  const contributors = await getContributorCount();

  return (
    <HomeContent
      skills={skills}
      categories={categories}
      contributorCount={contributors}
    />
  );
}

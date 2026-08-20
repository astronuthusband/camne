import { Hero } from "@/components/home/Hero";
import { PopularSearches } from "@/components/home/PopularSearches";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { getCategories } from "@/lib/queries/categories";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <PopularSearches />
      <CategoryGrid categories={categories} />
    </>
  );
}
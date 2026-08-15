import { Hero } from "@/components/home/Hero";
import { PopularSearches } from "@/components/home/PopularSearches";
import { CategoryGrid } from "@/components/home/CategoryGrid";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularSearches />
      <CategoryGrid />
    </>
  );
}

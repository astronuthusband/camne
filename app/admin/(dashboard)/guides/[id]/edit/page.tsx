import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  getAdminGuideById,
  getAdminCategories,
  getAdminExperts,
} from "@/lib/admin/queries";
import { GuideEditor } from "./GuideEditor";

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [guideData, categories, experts] = await Promise.all([
    getAdminGuideById(id),
    getAdminCategories(),
    getAdminExperts(),
  ]);

  if (!guideData) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Guides", href: "/admin/guides" },
          { label: guideData.guide.title },
        ]}
      />
      <GuideEditor
        guide={guideData.guide}
        initialSteps={guideData.steps}
        initialSources={guideData.sources}
        guideExperts={guideData.guideExperts}
        categories={categories}
        experts={experts}
      />
    </div>
  );
}

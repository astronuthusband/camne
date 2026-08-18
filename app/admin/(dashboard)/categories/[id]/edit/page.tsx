import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAdminCategoryById } from "@/lib/admin/queries";
import { CategoryForm } from "../../CategoryForm";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);
  if (!category) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/admin/categories" },
          { label: category.name },
        ]}
      />
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Edit {category.name}
      </h1>
      <CategoryForm category={category} action={updateCategory} />
    </div>
  );
}

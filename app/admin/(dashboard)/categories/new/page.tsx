import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Categories", href: "/admin/categories" },
          { label: "New" },
        ]}
      />
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        New category
      </h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}

import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ExpertForm } from "../ExpertForm";
import { createExpert } from "../actions";

export default function NewExpertPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Experts", href: "/admin/experts" },
          { label: "New" },
        ]}
      />
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        New expert
      </h1>
      <ExpertForm action={createExpert} />
    </div>
  );
}

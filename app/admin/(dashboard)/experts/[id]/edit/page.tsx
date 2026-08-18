import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getAdminExpertById } from "@/lib/admin/queries";
import { ExpertForm } from "../../ExpertForm";
import { updateExpert } from "../../actions";

export default async function EditExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await getAdminExpertById(id);
  if (!expert) notFound();

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Experts", href: "/admin/experts" },
          { label: expert.name },
        ]}
      />
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Edit {expert.name}
      </h1>
      <ExpertForm expert={expert} action={updateExpert} />
    </div>
  );
}

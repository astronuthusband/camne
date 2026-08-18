"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function readExpertFields(formData: FormData) {
  const credentialsRaw = String(formData.get("credentials") ?? "");
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    profession: String(formData.get("profession") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    photoUrl: String(formData.get("photoUrl") ?? "").trim(),
    // One credential per line in the textarea — simpler to edit than a
    // dynamic add/remove list for something this short.
    credentials: credentialsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

export async function createExpert(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = readExpertFields(formData);

  if (!fields.slug || !fields.name) {
    return { error: "Slug and name are required." };
  }

  const { error } = await supabase.from("experts").insert({
    slug: fields.slug,
    name: fields.name,
    profession: fields.profession || null,
    company: fields.company || null,
    bio: fields.bio || null,
    photo_url: fields.photoUrl || null,
    credentials: fields.credentials,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: `An expert with slug "${fields.slug}" already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/experts");
  redirect("/admin/experts");
}

export async function updateExpert(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const fields = readExpertFields(formData);

  if (!id) return { error: "Missing expert id." };
  if (!fields.slug || !fields.name) {
    return { error: "Slug and name are required." };
  }

  const { data: existing } = await supabase
    .from("experts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("experts")
    .update({
      slug: fields.slug,
      name: fields.name,
      profession: fields.profession || null,
      company: fields.company || null,
      bio: fields.bio || null,
      photo_url: fields.photoUrl || null,
      credentials: fields.credentials,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: `An expert with slug "${fields.slug}" already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/experts");
  if (existing) revalidatePath(`/experts/${existing.slug}`);
  if (existing && existing.slug !== fields.slug)
    revalidatePath(`/experts/${fields.slug}`);
  redirect("/admin/experts");
}

// Unlike categories, deleting an expert doesn't hit a foreign-key
// restriction — guide_experts has `on delete cascade` on expert_id, so
// deleting an expert also removes their attribution from every guide
// they were linked to. That's intentional (an expert record shouldn't
// dangle), but worth being deliberate about — hence the confirmation
// dialog on the button itself, not just relying on this action.
export async function deleteExpert(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing expert id." };

  const { error } = await supabase.from("experts").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/experts");
  return { error: null };
}

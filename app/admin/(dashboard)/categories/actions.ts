"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

function readCategoryFields(formData: FormData) {
  return {
    slug: String(formData.get("slug") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    icon: String(formData.get("icon") ?? "").trim(),
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  };
}

export async function createCategory(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const fields = readCategoryFields(formData);

  if (!fields.slug || !fields.name) {
    return { error: "Slug and name are required." };
  }

  const { error } = await supabase.from("categories").insert({
    slug: fields.slug,
    name: fields.name,
    description: fields.description || null,
    icon: fields.icon || null,
    sort_order: fields.sortOrder,
  });

  if (error) {
    // Postgres unique_violation on categories.slug
    if (error.code === "23505") {
      return { error: `A category with slug "${fields.slug}" already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories");
}

export async function updateCategory(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const fields = readCategoryFields(formData);

  if (!id) return { error: "Missing category id." };
  if (!fields.slug || !fields.name) {
    return { error: "Slug and name are required." };
  }

  const { data: existing } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase
    .from("categories")
    .update({
      slug: fields.slug,
      name: fields.name,
      description: fields.description || null,
      icon: fields.icon || null,
      sort_order: fields.sortOrder,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: `A category with slug "${fields.slug}" already exists.` };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  if (existing) revalidatePath(`/categories/${existing.slug}`);
  if (existing && existing.slug !== fields.slug)
    revalidatePath(`/categories/${fields.slug}`);
  redirect("/admin/categories");
}

// Category deletes are blocked at the database level (guides.category_id
// has `on delete restrict`) if any guide still references it — that's
// the real safety net. This just turns the resulting Postgres error into
// a readable message instead of a raw constraint-violation string.
export async function deleteCategory(
  _prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Missing category id." };

  const { data: existing } = await supabase
    .from("categories")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    if (error.code === "23503") {
      return {
        error:
          "Can't delete this category — it still has guides in it. Move or delete those guides first.",
      };
    }
    return { error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  if (existing) revalidatePath(`/categories/${existing.slug}`);
  return { error: null };
}

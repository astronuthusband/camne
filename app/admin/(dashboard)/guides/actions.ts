"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import type { SourceType } from "@/lib/supabase/database.types";

export interface GuideMetaPayload {
  title: string;
  slug: string;
  categoryId: string;
  overview: string;
  whoThisIsFor: string;
  beforeYouStart: string;
  estimatedCostText: string;
  estimatedTimeText: string;
  lastVerifiedAt: string; // "" or "yyyy-mm-dd"
  seoTitle: string;
  seoDescription: string;
  featuredImageUrl: string;
  status: "draft" | "published";
  whatYoullNeed: string[];
  commonMistakes: string[];
}

export interface StepPayload {
  title: string;
  content: string;
}

export interface SourcePayload {
  sourceType: SourceType;
  label: string;
  url: string;
}

// --- Create -----------------------------------------------------------

export async function createGuide(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");

  if (!title || !slug || !categoryId) {
    throw new Error("Title, slug, and category are required.");
  }

  const { data, error } = await supabase
    .from("guides")
    .insert({ title, slug, category_id: categoryId })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/guides");
  redirect(`/admin/guides/${data.id}/edit`);
}

// --- Save (meta + arrays + steps + sources, all at once) --------------

export async function saveGuide(
  guideId: string,
  payload: {
    meta: GuideMetaPayload;
    steps: StepPayload[];
    sources: SourcePayload[];
  }
): Promise<{ error: string | null }> {
  await requireAdmin();
  const supabase = await createClient();

  const { meta, steps, sources } = payload;

  if (!meta.title.trim() || !meta.slug.trim()) {
    return { error: "Title and slug can't be empty." };
  }

  const { data: currentGuide } = await supabase
    .from("guides")
    .select("slug")
    .eq("id", guideId)
    .maybeSingle();

  const { error: updateError } = await supabase
    .from("guides")
    .update({
      title: meta.title.trim(),
      slug: meta.slug.trim(),
      category_id: meta.categoryId,
      overview: meta.overview || null,
      who_this_is_for: meta.whoThisIsFor || null,
      before_you_start: meta.beforeYouStart || null,
      what_youll_need: meta.whatYoullNeed.filter((s) => s.trim()),
      estimated_cost_text: meta.estimatedCostText || null,
      estimated_time_text: meta.estimatedTimeText || null,
      common_mistakes: meta.commonMistakes.filter((s) => s.trim()),
      featured_image_url: meta.featuredImageUrl || null,
      status: meta.status,
      last_verified_at: meta.lastVerifiedAt || null,
      seo_title: meta.seoTitle || null,
      seo_description: meta.seoDescription || null,
    })
    .eq("id", guideId);

  if (updateError) return { error: updateError.message };

  // Steps and sources: full replace, same delete-then-insert pattern as
  // the SQL migrations use — simplest way to handle add/remove/reorder
  // without reconciling individual row diffs.
  const { error: deleteStepsError } = await supabase
    .from("guide_steps")
    .delete()
    .eq("guide_id", guideId);
  if (deleteStepsError) return { error: deleteStepsError.message };

  if (steps.length > 0) {
    const { error: insertStepsError } = await supabase
      .from("guide_steps")
      .insert(
        steps.map((s, i) => ({
          guide_id: guideId,
          step_number: i + 1,
          title: s.title,
          content: s.content,
          sort_order: i,
        }))
      );
    if (insertStepsError) return { error: insertStepsError.message };
  }

  const { error: deleteSourcesError } = await supabase
    .from("sources")
    .delete()
    .eq("guide_id", guideId);
  if (deleteSourcesError) return { error: deleteSourcesError.message };

  if (sources.length > 0) {
    const { error: insertSourcesError } = await supabase
      .from("sources")
      .insert(
        sources.map((s, i) => ({
          guide_id: guideId,
          source_type: s.sourceType,
          label: s.label,
          url: s.url,
          sort_order: i,
        }))
      );
    if (insertSourcesError) return { error: insertSourcesError.message };
  }

  revalidatePath("/admin/guides");
  revalidatePath(`/admin/guides/${guideId}/edit`);
  if (currentGuide) revalidatePath(`/guides/${currentGuide.slug}`);
  if (meta.slug !== currentGuide?.slug) revalidatePath(`/guides/${meta.slug}`);
  revalidatePath("/");

  return { error: null };
}

// --- Quick status toggle (from the list page) --------------------------

export async function setGuideStatus(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || (status !== "draft" && status !== "published")) return;

  const { data: guide } = await supabase
    .from("guides")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("guides").update({ status }).eq("id", id);

  revalidatePath("/admin/guides");
  revalidatePath("/");
  if (guide) revalidatePath(`/guides/${guide.slug}`);
}

// --- Delete --------------------------------------------------------------

export async function deleteGuide(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const { data: guide } = await supabase
    .from("guides")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("guides").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/guides");
  revalidatePath("/");
  if (guide) revalidatePath(`/guides/${guide.slug}`);
  redirect("/admin/guides");
}

// --- Expert attribution --------------------------------------------------

export async function addGuideExpert(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const guideId = String(formData.get("guideId") ?? "");
  const expertId = String(formData.get("expertId") ?? "");
  const adviceText = String(formData.get("adviceText") ?? "").trim();
  const interviewedAt = String(formData.get("interviewedAt") ?? "");

  if (!guideId || !expertId) return;

  const { error } = await supabase.from("guide_experts").upsert({
    guide_id: guideId,
    expert_id: expertId,
    advice_text: adviceText || null,
    interviewed_at: interviewedAt || null,
  });
  if (error) throw new Error(error.message);

  const { data: guide } = await supabase
    .from("guides")
    .select("slug")
    .eq("id", guideId)
    .maybeSingle();

  revalidatePath(`/admin/guides/${guideId}/edit`);
  if (guide) revalidatePath(`/guides/${guide.slug}`);
}

export async function removeGuideExpert(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const guideId = String(formData.get("guideId") ?? "");
  const expertId = String(formData.get("expertId") ?? "");
  if (!guideId || !expertId) return;

  await supabase
    .from("guide_experts")
    .delete()
    .eq("guide_id", guideId)
    .eq("expert_id", expertId);

  const { data: guide } = await supabase
    .from("guides")
    .select("slug")
    .eq("id", guideId)
    .maybeSingle();

  revalidatePath(`/admin/guides/${guideId}/edit`);
  if (guide) revalidatePath(`/guides/${guide.slug}`);
}

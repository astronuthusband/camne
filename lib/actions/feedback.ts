"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitFeedback(
  guideId: string,
  helpful: boolean,
  comment: string
): Promise<{ error: string | null }> {
  if (!guideId) return { error: "Missing guide." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("feedback").insert({
    guide_id: guideId,
    user_id: user?.id ?? null,
    helpful,
    comment: comment.trim() || null,
  });

  if (error) return { error: error.message };
  return { error: null };
}

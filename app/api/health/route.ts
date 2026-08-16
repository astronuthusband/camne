import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Temporary Phase 2 verification route — visit /api/health after setting
// up .env.local to confirm the app can actually reach Supabase and read
// through RLS correctly. Safe to leave in the codebase; it only exposes
// counts of already-public data.
//
// NOTE: deliberately fetches actual rows rather than using
// `{ count: "exact", head: true }` — HEAD-request count headers can get
// dropped in some network setups, which shows up as a confusing
// "ok: true" with count: null even though nothing is actually wrong with
// the query itself. Fetching real rows makes failures unambiguous:
// an empty array means the migrations (specifically 0003_seed_data.sql)
// haven't run, while an actual error means credentials or RLS.
export async function GET() {
  const supabase = await createClient();

  const [
    { data: categories, error: catError },
    { data: guides, error: guideError },
  ] = await Promise.all([
    supabase.from("categories").select("id, slug"),
    supabase.from("guides").select("id, slug").eq("status", "published"),
  ]);

  if (catError || guideError) {
    return NextResponse.json(
      {
        ok: false,
        error: catError?.message ?? guideError?.message,
        hint: "Check that .env.local has the correct NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, and that migrations 0001–0003 ran successfully.",
      },
      { status: 500 }
    );
  }

  const categoryCount = categories?.length ?? 0;
  const guideCount = guides?.length ?? 0;

  return NextResponse.json({
    ok: true,
    categories: categoryCount,
    publishedGuides: guideCount,
    hint:
      categoryCount === 0 || guideCount === 0
        ? "Connected to Supabase successfully, but tables are empty — did 0003_seed_data.sql run?"
        : undefined,
  });
}
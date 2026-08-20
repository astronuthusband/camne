import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { GuideCard } from "@/components/guide/GuideCard";

// Deliberately NOT statically generated — this page's entire purpose is
// "show me MY data," so it has to run per-request with the real signed-in
// user's session. That's a fine trade-off here; it's exactly the one
// page in the app where dynamic rendering is the right call, unlike the
// shared layout (see the note in components/layout/AuthNav.tsx).
export default async function BookmarksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Sign in to see your bookmarks
        </h1>
        <p className="mt-2 text-ink-soft">
          Save guides you want to come back to.
        </p>
        <Link
          href="/login?returnTo=/bookmarks"
          className="mt-6 inline-block rounded-full bg-teal px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-deep"
        >
          Log in
        </Link>
      </div>
    );
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("guide_id")
    .eq("user_id", user.id);

  const guideIds = (bookmarks ?? []).map((b) => b.guide_id);

  const { data: guides } =
    guideIds.length > 0
      ? await supabase
          .from("guides")
          .select("slug, title, estimated_cost_text, estimated_time_text")
          .in("id", guideIds)
          .eq("status", "published")
      : { data: [] };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">
        Your bookmarks
      </h1>

      {!guides || guides.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-ink-soft">
          <p className="font-medium text-ink">No bookmarks yet.</p>
          <p className="mt-1 text-sm">
            Tap &ldquo;Save&rdquo; on any guide to keep it here.
          </p>
          <Link href="/" className="mt-4 inline-block text-sm text-teal hover:underline">
            Browse guides
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((g) => (
            <GuideCard
              key={g.slug}
              guide={{
                slug: g.slug,
                title: g.title,
                estimatedCostText: g.estimated_cost_text,
                estimatedTimeText: g.estimated_time_text,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

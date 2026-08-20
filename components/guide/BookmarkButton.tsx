"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function BookmarkButton({ guideId }: { guideId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const [bookmarked, setBookmarked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (!uid) return;

      const { data: existing } = await supabase
        .from("bookmarks")
        .select("guide_id")
        .eq("user_id", uid)
        .eq("guide_id", guideId)
        .maybeSingle();
      setBookmarked(!!existing);
    });
  }, [guideId]);

  async function toggle() {
    if (userId === undefined || pending) return;

    if (!userId) {
      router.push(`/login?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }

    setPending(true);
    const supabase = createClient();

    if (bookmarked) {
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", userId)
        .eq("guide_id", guideId);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ user_id: userId, guide_id: guideId });
      setBookmarked(true);
    }
    setPending(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={pending || userId === undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${
        bookmarked
          ? "border-teal bg-teal-soft text-teal-deep"
          : "border-border text-ink-soft hover:border-teal hover:text-teal"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={bookmarked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4-7 4V4.5a1 1 0 0 1 1-1Z" />
      </svg>
      {bookmarked ? "Saved" : "Save"}
    </button>
  );
}

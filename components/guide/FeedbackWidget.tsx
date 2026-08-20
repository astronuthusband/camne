"use client";

import { useState, useTransition } from "react";
import { submitFeedback } from "@/lib/actions/feedback";

type Stage = "asking" | "commenting" | "done";

export function FeedbackWidget({ guideId }: { guideId: string }) {
  const [stage, setStage] = useState<Stage>("asking");
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleHelpful(helpful: boolean) {
    if (!helpful) {
      setStage("commenting");
      return;
    }
    startTransition(async () => {
      await submitFeedback(guideId, true, "");
      setStage("done");
    });
  }

  function handleSubmitComment() {
    startTransition(async () => {
      await submitFeedback(guideId, false, comment);
      setStage("done");
    });
  }

  if (stage === "done") {
    return (
      <div className="mt-8 rounded-2xl border border-border bg-paper-raised p-5 text-sm text-ink-soft">
        Thanks for the feedback — it helps us keep this guide accurate.
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-paper-raised p-5">
      <p className="text-sm font-medium text-ink">Was this helpful?</p>

      {stage === "asking" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => handleHelpful(true)}
            disabled={isPending}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-teal hover:text-teal disabled:opacity-60"
          >
            👍 Yes
          </button>
          <button
            onClick={() => handleHelpful(false)}
            disabled={isPending}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink-soft transition hover:border-coral hover:text-coral disabled:opacity-60"
          >
            👎 No
          </button>
        </div>
      )}

      {stage === "commenting" && (
        <div className="mt-3 space-y-2">
          <label className="block text-xs text-ink-soft">
            What was missing? (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            className="w-full rounded-xl border border-border bg-paper px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
          />
          <button
            onClick={handleSubmitComment}
            disabled={isPending}
            className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-deep disabled:opacity-60"
          >
            {isPending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      )}
    </div>
  );
}

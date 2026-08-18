"use client";

import { deleteGuide } from "./actions";

export function DeleteGuideButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteGuide}
      onSubmit={(e) => {
        if (!confirm(`Delete "${title}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-coral hover:underline">
        Delete
      </button>
    </form>
  );
}

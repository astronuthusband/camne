"use client";

import { useActionState } from "react";
import { deleteCategory } from "./actions";

export function DeleteCategoryButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [state, formAction, pending] = useActionState(deleteCategory, {
    error: null,
  });

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This can't be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-coral hover:underline disabled:opacity-60"
      >
        Delete
      </button>
      {state.error && (
        <p className="mt-1 max-w-xs text-right text-xs text-coral">
          {state.error}
        </p>
      )}
    </form>
  );
}

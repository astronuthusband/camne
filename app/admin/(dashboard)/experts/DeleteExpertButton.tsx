"use client";

import { useActionState } from "react";
import { deleteExpert } from "./actions";

export function DeleteExpertButton({ id, name }: { id: string; name: string }) {
  const [state, formAction, pending] = useActionState(deleteExpert, {
    error: null,
  });

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete "${name}"? This also removes their attribution from any guides they're linked to.`
          )
        ) {
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

import type { GuideStepRow } from "@/lib/queries/guides";

export function StepList({ steps }: { steps: GuideStepRow[] }) {
  if (steps.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-ink">
        Step-by-step
      </h2>
      <ol className="mt-4 space-y-5">
        {steps.map((step) => (
          <li key={step.id} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal font-mono text-sm text-white">
              {step.step_number}
            </span>
            <div className="pt-0.5">
              <p className="font-medium text-ink">{step.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {step.content}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

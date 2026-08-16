import type { GuideExpertAttribution } from "@/lib/queries/guides";

export function ExpertAdvice({
  attributions,
}: {
  attributions: GuideExpertAttribution[];
}) {
  if (attributions.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="font-display text-lg font-semibold text-ink">
        Expert advice
      </h2>
      <div className="mt-3 space-y-4">
        {attributions.map(({ expert, adviceText, interviewedAt }) => (
          <div
            key={expert.id}
            className="rounded-2xl border border-gold-soft bg-gold-soft/40 p-5"
          >
            {adviceText && (
              <p className="text-sm leading-relaxed text-ink">
                &ldquo;{adviceText}&rdquo;
              </p>
            )}
            <div className="mt-3 flex items-center gap-3">
              {expert.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={expert.photo_url}
                  alt={expert.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-display text-sm text-white">
                  {expert.name.charAt(0)}
                </span>
              )}
              <div className="text-sm">
                <p className="font-medium text-ink">{expert.name}</p>
                <p className="text-ink-soft">
                  {[expert.profession, expert.company]
                    .filter(Boolean)
                    .join(" · ")}
                  {interviewedAt &&
                    ` — interviewed ${new Date(
                      interviewedAt
                    ).toLocaleDateString("en-MY", {
                      month: "long",
                      year: "numeric",
                    })}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

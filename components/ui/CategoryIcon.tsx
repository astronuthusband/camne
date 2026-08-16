import type { CategorySlug } from "@/lib/types";

// Simple, consistent-stroke line icons, hand-picked per category rather than
// pulled from a generic icon set — keeps the visual language specific to
// what each category actually involves.
const paths: Record<CategorySlug, React.ReactNode> = {
  government: (
    <>
      <path d="M4 21h16" />
      <path d="M5 21V10l7-5 7 5v11" />
      <path d="M9 21v-6h6v6" />
    </>
  ),
  business: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="1.5" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
    </>
  ),
  property: (
    <>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10v10h13V10" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  cars: (
    <>
      <path d="M4 16V12l2-5h12l2 5v4" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.5" />
      <circle cx="16.5" cy="16.5" r="1.5" />
    </>
  ),
  money: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9" />
      <path d="M9.5 9.8c0-1.1 1.1-1.9 2.5-1.9s2.5.8 2.5 1.7c0 2.4-5 1.2-5 3.6 0 .9 1.1 1.7 2.5 1.7s2.5-.8 2.5-1.9" />
    </>
  ),
  education: (
    <>
      <path d="M3 9.5 12 5l9 4.5-9 4.5-9-4.5Z" />
      <path d="M7 11.8v4.4c0 1.2 2.2 2.3 5 2.3s5-1.1 5-2.3v-4.4" />
    </>
  ),
  home: (
    <>
      <path d="M4 11 12 4l8 7" />
      <path d="M6 10v10h12V10" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  everyday: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
};

export function CategoryIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const iconPaths =
    slug in paths ? paths[slug as CategorySlug] : paths.everyday;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths}
    </svg>
  );
}

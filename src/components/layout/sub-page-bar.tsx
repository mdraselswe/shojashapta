import { BackButton } from "./back-button";

/** Top bar of a detail page: a round back button to the fixed parent. */
export function SubPageBar({ backHref }: { backHref: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <BackButton href={backHref} />
    </div>
  );
}

import { ClaimStatusBadge } from "@/features/claim/components/claim-status-badge";
import { StillCorrectButton, VerifyPrompt } from "@/features/claim/components/verify-prompt";
import { Skeleton } from "@/components/ui/skeleton";
import { getT } from "@/i18n/server";
import { claimBadge } from "@/lib/claims/badge";

import { getPlaceClaims } from "../queries";

const SKELETON_ROWS = 2;
const ROW_CLASS = "flex min-h-9 flex-wrap items-center gap-2";

/**
 * What the community knows about this place and its dishes, one badge per fact, each with a way to
 * confirm it: a one-tap "এখনও ঠিক আছে?" when it is stale, and the full verify sheet.
 */
export async function PlaceClaimsSection({ placeId }: { placeId: string }) {
  const t = getT();
  const { items: claims, asOf } = await getPlaceClaims(placeId);
  if (claims.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2 page-x pt-3">
      {claims.map((claim) => {
        const stale = claimBadge(claim, asOf).kind === "stale";
        const summary = [claim.subject, t(`claim.types.${claim.type}`), claim.valueText]
          .filter(Boolean)
          .join(" · ");
        return (
          <li key={claim.id} className={ROW_CLASS}>
            <ClaimStatusBadge claim={claim} now={asOf} />
            {stale && <StillCorrectButton claimId={claim.id} />}
            <VerifyPrompt claimId={claim.id} summary={summary} />
          </li>
        );
      })}
    </ul>
  );
}

export function PlaceClaimsSectionSkeleton() {
  return (
    <div className="flex flex-col gap-2 page-x pt-3" aria-hidden>
      {Array.from({ length: SKELETON_ROWS }, (_, index) => (
        <div key={index} className={ROW_CLASS}>
          <Skeleton className="h-7 w-44 rounded-[10px]" />
          <Skeleton className="h-9 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

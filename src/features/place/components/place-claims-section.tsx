import { ClaimStatusBadge } from "@/features/claim/components/claim-status-badge";
import { Skeleton } from "@/components/ui/skeleton";

import { getPlaceClaims } from "../queries";

const SKELETON_BADGES = 3;

/** What the community knows about this place (price, opening status, location…), as badges. */
export async function PlaceClaimsSection({ placeId }: { placeId: string }) {
  const { items: claims, asOf } = await getPlaceClaims(placeId);
  if (claims.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2 page-x pt-3">
      {claims.map((claim) => (
        <li key={claim.type}>
          <ClaimStatusBadge claim={claim} now={asOf} />
        </li>
      ))}
    </ul>
  );
}

export function PlaceClaimsSectionSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 page-x pt-3" aria-hidden>
      {Array.from({ length: SKELETON_BADGES }, (_, index) => (
        <Skeleton key={index} className="h-7 w-28 rounded-[10px]" />
      ))}
    </div>
  );
}

import {
  CircleCheckIcon,
  CircleHelpIcon,
  CircleXIcon,
  ClockIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { getT } from "@/i18n/server";
import { claimBadge } from "@/lib/claims/badge";
import type { ClaimType } from "@/lib/claims/status";
import { formatNumber } from "@/lib/format/number";
import type { PlaceClaimRow } from "@/services/catalog-service";

/**
 * What the community knows about one fact ("দাম · কমিউনিটি নিশ্চিত"). Always icon + text, and wording
 * follows decision P9: "কমিউনিটি নিশ্চিত", never "Verified".
 */
export function ClaimStatusBadge({ claim, now }: { claim: PlaceClaimRow; now?: Date }) {
  const t = getT();
  const badge = claimBadge(claim, now);
  const type = t(`claim.types.${claim.type satisfies ClaimType}`);

  switch (badge.kind) {
    case "confirmed":
      return (
        <Badge variant="success">
          <CircleCheckIcon aria-hidden />
          {type} · {t("claim.confirmed")}
        </Badge>
      );
    case "stale":
      return (
        <Badge variant="stale">
          <ClockIcon aria-hidden />
          {type} · {t("claim.stale", { days: formatNumber(badge.days ?? 0) })}
        </Badge>
      );
    case "mixed":
      return (
        <Badge variant="warning">
          <TriangleAlertIcon aria-hidden />
          {type} · {t("claim.mixed")}
        </Badge>
      );
    case "disputed":
      return (
        <Badge variant="danger">
          <CircleXIcon aria-hidden />
          {type} · {t("claim.disputed")}
        </Badge>
      );
    case "unverified":
      return (
        <Badge variant="muted">
          <CircleHelpIcon aria-hidden />
          {type} · {t("claim.unverified")}
        </Badge>
      );
  }
}

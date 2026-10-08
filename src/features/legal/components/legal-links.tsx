import Link from "next/link";

import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";

/** Small links to the about and privacy pages (end of home, in the profile settings). */
export function LegalLinks() {
  const t = getT();
  return (
    <nav
      aria-label={t("legal.policyLink")}
      className="flex flex-wrap gap-x-5 gap-y-1 page-x pt-8 text-meta"
    >
      <Link
        href={routes.about()}
        className="py-2 text-muted-foreground underline-offset-4 hover:underline"
      >
        {t("legal.aboutLink")}
      </Link>
      <Link
        href={routes.policy()}
        className="py-2 text-muted-foreground underline-offset-4 hover:underline"
      >
        {t("legal.policyLink")}
      </Link>
    </nav>
  );
}

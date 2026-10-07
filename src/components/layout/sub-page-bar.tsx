import Link from "next/link";

import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";

import { BackButton } from "./back-button";

export type Crumb = { label: string; href?: string };

/**
 * Top of a detail page. Phones and tablets get a round back button to the fixed parent; from 1024px
 * the breadcrumb takes over (docs/design/desktop). The current page is the last crumb, no link.
 */
export function SubPageBar({ backHref, crumbs = [] }: { backHref: string; crumbs?: Crumb[] }) {
  const t = getT();
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-3 md:px-6 lg:hidden">
        <BackButton href={backHref} />
      </div>
      <nav
        aria-label={t("breadcrumb.label")}
        className="hidden items-center gap-2 page-x pt-7 text-meta text-muted-foreground lg:flex"
      >
        <Link href={routes.home()} className="text-primary-text">
          {t("nav.home")}
        </Link>
        {crumbs.map((crumb, index) => (
          <span key={`${index}-${crumb.label}`} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {crumb.href ? (
              <Link href={crumb.href} className="text-primary-text">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

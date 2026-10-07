import Link from "next/link";

import { toggleVariants } from "@/components/ui/toggle-variants";
import { appConfig } from "@/config/app.config";
import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";

import { PLACE_TYPES, type ParsedSearchParams } from "../search-params";

// Filter chips are links: the filter lives in the URL, so results are shareable and need no JS.
const ROW_CLASS =
  "-mx-4 flex gap-2 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0";

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      data-state={active ? "on" : "off"}
      className={toggleVariants({ variant: "chip" })}
    >
      {children}
    </Link>
  );
}

export function SearchFilters({ params }: { params: ParsedSearchParams }) {
  const t = getT();
  const { q, tab, type, price } = params;
  const tabParam = tab === "all" ? {} : { tab };
  const link = (next: { type?: string | undefined; price?: string | undefined }) =>
    routes.search({ q, ...tabParam, ...next });

  return (
    <div className="flex flex-col gap-2" role="group" aria-label={t("search.filters.label")}>
      <div className={ROW_CLASS}>
        <Chip href={link({ price })} active={type === undefined}>
          {t("search.filters.any")}
        </Chip>
        {PLACE_TYPES.filter((candidate) => candidate !== "other").map((candidate) => (
          <Chip key={candidate} href={link({ type: candidate, price })} active={type === candidate}>
            {t(`placeType.${candidate}`)}
          </Chip>
        ))}
      </div>
      <div className={ROW_CLASS}>
        <Chip href={link({ type })} active={price === undefined}>
          {t("search.filters.price")}: {t("search.filters.any")}
        </Chip>
        {appConfig.search.priceTiers.map((tier) => (
          <Chip key={tier.id} href={link({ type, price: tier.id })} active={price === tier.id}>
            {t(`search.price.${tier.id}`)}
          </Chip>
        ))}
      </div>
    </div>
  );
}

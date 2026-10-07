import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { LoadingRegion } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";

import { parseSearchParams, type RawSearchParams } from "../search-params";
import { SearchBox, SearchBoxSkeleton } from "./search-box";
import { SearchResults, SearchResultsSkeleton } from "./search-results";

function SearchTopBar({ children }: { children: React.ReactNode }) {
  const t = getT();
  return (
    <div className="flex items-start gap-2 px-4 py-3">
      <Button asChild variant="outline" size="icon" className="mt-1.5 shrink-0">
        <Link href={routes.home()} aria-label={t("search.back")}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      {children}
    </div>
  );
}

async function SearchBoxFromUrl({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  const { q } = parseSearchParams(await searchParams);
  return <SearchBox initialQuery={q} />;
}

/** The URL is the source of truth: `?q=&tab=&type=&price=`. */
export function SearchPage({ searchParams }: { searchParams: Promise<RawSearchParams> }) {
  return (
    <PageShell
      header={
        <SearchTopBar>
          <Suspense fallback={<SearchBoxSkeleton />}>
            <SearchBoxFromUrl searchParams={searchParams} />
          </Suspense>
        </SearchTopBar>
      }
    >
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </PageShell>
  );
}

export function SearchPageSkeleton() {
  const t = getT();
  return (
    <LoadingRegion label={t("common.loading")}>
      <PageShell
        header={
          <SearchTopBar>
            <SearchBoxSkeleton />
          </SearchTopBar>
        }
      >
        <SearchResultsSkeleton />
      </PageShell>
    </LoadingRegion>
  );
}

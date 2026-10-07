import type { Metadata } from "next";

import { SearchPage } from "@/features/search/components/search-page";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

// Search results are personal queries: not worth indexing.
export const metadata: Metadata = buildMetadata({
  title: getT()("search.label"),
  description: getT()("search.prompt"),
  path: "/search",
  noindex: true,
});

export default function Search({ searchParams }: PageProps<"/search">) {
  return <SearchPage searchParams={searchParams} />;
}

import { serializeLd } from "@/lib/seo/jsonld";

/** Prints structured data as server HTML so crawlers see it without running JavaScript. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeLd(data) }} />
  );
}

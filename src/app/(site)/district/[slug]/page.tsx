import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { appConfig } from "@/config/app.config";
import { routes } from "@/config/routes";
import { getStaticSlugs } from "@/features/catalog/queries";
import { DistrictPage } from "@/features/district/components/district-page";
import { getDistrictHeader, getDistrictPlaces } from "@/features/district/queries";
import { getT } from "@/i18n/server";
import { breadcrumbLd, itemListLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const { districts } = await getStaticSlugs();
  return districts.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/district/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const district = await getDistrictHeader(slug);
  if (!district) return {};
  // A district with nothing to show yet stays out of search results until it has content.
  const places = await getDistrictPlaces(district.id);
  const thin =
    places.items.length < appConfig.seo.minPlacesToIndexDistrict && district.famous.length === 0;
  return buildMetadata({
    noindex: thin,
    title: district.nameBn,
    description: getT()("search.districtMeta", { division: district.divisionBn }),
    path: routes.district(slug),
  });
}

export default async function District({ params }: PageProps<"/district/[slug]">) {
  const { slug } = await params;
  const district = await getDistrictHeader(slug);
  if (!district) notFound();
  return (
    <>
      <DistrictPage district={district} />
      <JsonLd
        data={[
          breadcrumbLd([
            { name: getT()("nav.home"), path: routes.home() },
            { name: district.nameBn, path: routes.district(district.slug) },
          ]),
          ...(district.famous.length > 0
            ? [
                itemListLd(
                  getT()("food.famousIn", { district: district.nameBn }),
                  district.famous.map((entry) => ({
                    name: entry.food.nameBn,
                    path: routes.districtFood(district.slug, entry.food.slug),
                  })),
                ),
              ]
            : []),
        ]}
      />
    </>
  );
}

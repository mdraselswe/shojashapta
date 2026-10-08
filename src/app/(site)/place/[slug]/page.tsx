import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { routes } from "@/config/routes";
import { getStaticSlugs } from "@/features/catalog/queries";
import { PlacePage } from "@/features/place/components/place-page";
import { getPlaceHeader, getPlaceRedirect } from "@/features/place/queries";
import { getT } from "@/i18n/server";
import { breadcrumbLd, placeLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const { places } = await getStaticSlugs();
  return places.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/place/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceHeader(slug);
  if (!place) return {};
  const t = getT();
  return buildMetadata({
    title: place.nameBn,
    description: `${t(`placeType.${place.type}`)} · ${place.district.nameBn}`,
    path: routes.place(slug),
  });
}

export default async function Place({ params }: PageProps<"/place/[slug]">) {
  const { slug } = await params;
  const place = await getPlaceHeader(slug);
  if (!place) {
    const target = await getPlaceRedirect(slug);
    if (target) permanentRedirect(routes.place(target));
    notFound();
  }
  return (
    <>
      <PlacePage place={place} />
      <JsonLd
        data={[
          placeLd({
            slug: place.slug,
            nameBn: place.nameBn,
            nameEn: place.nameEn,
            type: place.type,
            districtNameBn: place.district.nameBn,
            address: place.address,
          }),
          breadcrumbLd([
            { name: getT()("nav.home"), path: routes.home() },
            { name: place.district.nameBn, path: routes.district(place.district.slug) },
            { name: place.nameBn, path: routes.place(place.slug) },
          ]),
        ]}
      />
    </>
  );
}

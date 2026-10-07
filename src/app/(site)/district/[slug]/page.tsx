import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import { getStaticSlugs } from "@/features/catalog/queries";
import { DistrictPage } from "@/features/district/components/district-page";
import { getDistrictHeader } from "@/features/district/queries";
import { getT } from "@/i18n/server";
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
  return buildMetadata({
    title: district.nameBn,
    description: getT()("search.districtMeta", { division: district.divisionBn }),
    path: routes.district(slug),
  });
}

export default async function District({ params }: PageProps<"/district/[slug]">) {
  const { slug } = await params;
  const district = await getDistrictHeader(slug);
  if (!district) notFound();
  return <DistrictPage district={district} />;
}

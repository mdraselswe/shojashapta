import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import { getStaticSlugs } from "@/features/catalog/queries";
import { DistrictFoodPage } from "@/features/district/components/district-food-page";
import { getDistrictFood } from "@/features/district/queries";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

// The curated pairs are the pages worth prerendering; other pairs render on first visit.
export async function generateStaticParams() {
  const { districtFoods } = await getStaticSlugs();
  return districtFoods.map(({ district, food }) => ({ slug: district, foodSlug: food }));
}

export async function generateMetadata({
  params,
}: PageProps<"/district/[slug]/[foodSlug]">): Promise<Metadata> {
  const { slug, foodSlug } = await params;
  const data = await getDistrictFood(slug, foodSlug);
  if (!data) return {};
  const t = getT();
  return buildMetadata({
    title: t("district.titleFood", { district: data.district.nameBn, food: data.food.nameBn }),
    description: data.noteBn ?? data.food.aboutBn ?? t("food.dishesAll"),
    path: routes.districtFood(slug, foodSlug),
  });
}

export default async function DistrictFood({ params }: PageProps<"/district/[slug]/[foodSlug]">) {
  const { slug, foodSlug } = await params;
  const data = await getDistrictFood(slug, foodSlug);
  if (!data) notFound();
  return <DistrictFoodPage data={data} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { routes } from "@/config/routes";
import { getStaticSlugs } from "@/features/catalog/queries";
import { FoodPage } from "@/features/food/components/food-page";
import { getFoodHeader } from "@/features/food/queries";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const { foods } = await getStaticSlugs();
  return foods.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/food/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const food = await getFoodHeader(slug);
  if (!food) return {};
  return buildMetadata({
    title: food.nameBn,
    description: food.aboutBn ?? getT()("food.dishesAll"),
    path: routes.food(slug),
  });
}

export default async function Food({ params }: PageProps<"/food/[slug]">) {
  const { slug } = await params;
  const food = await getFoodHeader(slug);
  if (!food) notFound();
  return <FoodPage food={food} />;
}

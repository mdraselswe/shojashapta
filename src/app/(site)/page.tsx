import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/config/site";
import { HomePage } from "@/features/home/components/home-page";
import { websiteLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ description: siteConfig.description, path: "/" });

export default function Home() {
  return (
    <>
      <HomePage />
      <JsonLd data={websiteLd()} />
    </>
  );
}

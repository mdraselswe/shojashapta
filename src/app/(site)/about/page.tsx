import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { LegalPage } from "@/features/legal/components/legal-page";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("legal.about.title"),
  description: getT()("legal.about.lead"),
  path: routes.about(),
});

export default function Page() {
  return <LegalPage kind="about" />;
}

import type { Metadata } from "next";

import { LogoMark } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";
import { getT } from "@/i18n/server";

// Shown for every page until launch (src/proxy.ts).
export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — ${getT()("comingSoon.title")}` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  const t = getT();
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-end gap-3 px-6 pt-16 pb-24">
      <LogoMark title="" className="mb-4 size-16" />
      <h1 className="text-display">{siteConfig.name}</h1>
      <p className="text-heading text-muted-foreground">{siteConfig.tagline}</p>
      <p className="mt-6 text-body">{t("comingSoon.body")}</p>
    </main>
  );
}

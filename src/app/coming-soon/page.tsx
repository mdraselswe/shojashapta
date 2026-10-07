import type { Metadata } from "next";

import { LogoMark } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

// Shown for every page until launch (src/proxy.ts). TODO(0.8): copy moves to bn.json.
export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — শিগগিরই আসছে` },
  description: siteConfig.description,
  robots: { index: false, follow: false },
};

export default function ComingSoonPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-end gap-3 px-6 pt-16 pb-24">
      <LogoMark title="" className="mb-4 size-16" />
      <h1 className="text-display">{siteConfig.name}</h1>
      <p className="text-heading text-muted-foreground">{siteConfig.tagline}</p>
      <p className="mt-6 text-body">
        বাংলাদেশে কোথায় কী খাবেন, তা জানাবে কমিউনিটির সত্যিকারের অভিজ্ঞতা। শিগগিরই আসছে।
      </p>
    </main>
  );
}

import { LogoLockup } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

// Placeholder home until the app shell (0.6) and the real home page (Phase 2.1).
// The tagline is real text, not the outlined `tagline` lockup: that SVG path is ~21 KB and is sent
// twice (HTML + RSC payload), which alone pushed mobile LCP over budget.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-5">
      <LogoLockup className="h-12" />
      <p className="text-heading text-muted-foreground">{siteConfig.tagline}</p>
      <p className="text-body">{siteConfig.description}</p>
    </main>
  );
}

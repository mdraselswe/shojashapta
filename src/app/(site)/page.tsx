import { PageShell } from "@/components/layout/page-shell";
import { siteConfig } from "@/config/site";

// Placeholder home inside the app shell until the real home page (Phase 2.1).
export default function Home() {
  return (
    <PageShell className="justify-center gap-3 px-5">
      <h1 className="text-title-1">{siteConfig.tagline}</h1>
      <p className="text-body text-muted-foreground">{siteConfig.description}</p>
    </PageShell>
  );
}

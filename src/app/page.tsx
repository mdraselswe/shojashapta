import { LogoLockup } from "@/components/brand/logo";
import { siteConfig } from "@/config/site";

// Placeholder home until the app shell (0.6) and the real home page (Phase 2.1).
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5">
      <LogoLockup tagline className="h-14" />
      <p className="text-body text-muted-foreground">{siteConfig.description}</p>
    </main>
  );
}

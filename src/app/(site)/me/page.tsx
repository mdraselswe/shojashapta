import type { Metadata } from "next";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { LoginGate } from "@/features/auth/components/login-gate";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

// Personal page: never indexed. The profile tabs and the passport arrive in Phase 6.
export const metadata: Metadata = buildMetadata({
  title: getT()("auth.profileTitle"),
  description: getT()("auth.loginBody"),
  path: "/me",
  noindex: true,
});

export default function Me() {
  const t = getT();
  return (
    <LoginGate next={routes.me()}>
      {(user) => (
        <PageShell>
          <section className="page-x pt-6 lg:pt-12">
            <h1 className="text-title-1">{t("auth.welcome", { name: user.displayName })}</h1>
            <form action={routes.signOut()} method="post" className="mt-5">
              <Button type="submit" variant="outline">
                {t("auth.signOut")}
              </Button>
            </form>
          </section>
        </PageShell>
      )}
    </LoginGate>
  );
}

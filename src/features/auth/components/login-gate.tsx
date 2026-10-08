import type { ReactNode } from "react";

import { PageShell } from "@/components/layout/page-shell";
import type { AppUser } from "@/core/domain";
import { getServices } from "@/infrastructure/container";
import { getT } from "@/i18n/server";

import { LoginPrompt } from "./login-prompt";

/**
 * Shows its content only to a signed-in, non-banned user; everyone else gets the login prompt that
 * returns them to `next`. Reads cookies, so it must sit behind a Suspense boundary (loading.tsx).
 */
export async function LoginGate({
  next,
  children,
}: {
  next: string;
  children: (user: AppUser) => ReactNode;
}) {
  const session = await getServices().auth.getSession();
  if (!session) return <LoginPrompt next={next} />;
  if (session.user.isBanned) {
    const t = getT();
    return (
      <PageShell>
        <p role="alert" className="page-x pt-10 text-body">
          {t("auth.banned")}
        </p>
      </PageShell>
    );
  }
  return children(session.user);
}

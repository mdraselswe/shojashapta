import type { Metadata } from "next";

import { routes } from "@/config/routes";
import { LoginGate } from "@/features/auth/components/login-gate";
import { MePage, parseMeTab } from "@/features/me/components/me-page";
import { getT } from "@/i18n/server";
import { buildMetadata } from "@/lib/seo/metadata";

// Personal page: never indexed. The passport joins it in Phase 6b.
export const metadata: Metadata = buildMetadata({
  title: getT()("auth.profileTitle"),
  description: getT()("auth.loginBody"),
  path: "/me",
  noindex: true,
});

export default function Me({ searchParams }: PageProps<"/me">) {
  return (
    <LoginGate next={routes.me()}>
      {async (user) => <MePage user={user} tab={parseMeTab((await searchParams).tab)} />}
    </LoginGate>
  );
}

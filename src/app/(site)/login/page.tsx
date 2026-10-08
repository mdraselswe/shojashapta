import type { Metadata } from "next";

import { LoginPrompt } from "@/features/auth/components/login-prompt";
import { getT } from "@/i18n/server";
import { safeNext } from "@/lib/auth/safe-next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: getT()("auth.loginTitle"),
  description: getT()("auth.loginBody"),
  path: "/login",
  noindex: true,
});

export default async function Login({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  return <LoginPrompt next={safeNext(first(params.next))} failed={first(params.error) === "1"} />;
}

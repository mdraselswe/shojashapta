"use client";

import Link from "next/link";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { useT } from "@/i18n/client";

/** A page failed to render: say so plainly and offer a retry (docs: errors never dead-end). */
export default function SiteError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const t = useT();
  return (
    <PageShell>
      <section className="page-x pt-10" role="alert">
        <h1 className="text-title-1">{t("errorPage.title")}</h1>
        <p className="mt-2 text-body text-muted-foreground">{t("errorPage.body")}</p>
        {error.digest ? (
          <p className="mt-2 text-caption text-muted-foreground">
            {t("errorPage.code", { digest: error.digest })}
          </p>
        ) : null}
        <div className="mt-5 flex gap-3">
          <Button onClick={() => retry()}>{t("common.retry")}</Button>
          <Button asChild variant="outline">
            <Link href={routes.home()}>{t("notFound.home")}</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}

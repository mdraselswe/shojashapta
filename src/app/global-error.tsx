"use client";

import { ThemeScript } from "@/components/theme/theme-script";
import { createT } from "@/i18n/t";
import "@/styles/globals.css";

const t = createT("bn");

/** Last resort: the root layout itself failed, so this renders its own <html>. A full reload home, since the router may be what failed. */
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh">
        <main className="mx-auto max-w-lg px-5 pt-16" role="alert">
          <h1 className="text-title-1">{t("errorPage.title")}</h1>
          <p className="mt-2 text-body text-muted-foreground">{t("errorPage.body")}</p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-11 press items-center rounded-full bg-primary px-5 font-semibold text-primary-foreground"
            >
              {t("common.retry")}
            </button>
            <button
              type="button"
              onClick={() => window.location.assign(window.location.origin)}
              className="inline-flex h-11 press items-center rounded-full border border-border px-5 font-semibold"
            >
              {t("notFound.home")}
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}

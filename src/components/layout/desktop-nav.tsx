"use client";

import { PlusIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoLockup } from "@/components/brand/logo";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/t";
import { cn } from "@/lib/cn";

const LINKS: readonly { href: string; label: MessageKey }[] = [
  { href: routes.home(), label: "nav.home" },
  { href: routes.search(), label: "nav.search" },
  { href: routes.me(), label: "nav.me" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Top bar from 1024px up (docs/design/desktop): logo, search, main links and the primary "যোগ"
 * button. It replaces the floating bottom nav and the mobile header, which are hidden at this size.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const t = useT();
  const onSearch = isActive(pathname, routes.search());
  return (
    <header className="hidden border-b border-border bg-card lg:block">
      <div className="mx-auto flex h-18 max-w-[1200px] items-center gap-6 px-8">
        <Link
          href={routes.home()}
          aria-label={siteConfig.name}
          className="-m-1 press rounded-xl p-1"
        >
          <LogoLockup className="h-9" />
        </Link>
        {!onSearch && (
          <Link
            href={routes.search()}
            className="flex h-[46px] max-w-[440px] flex-1 press items-center gap-2.5 rounded-[14px] border border-border bg-background px-4 text-[15px] text-muted-foreground"
          >
            <SearchIcon className="size-5 shrink-0" aria-hidden />
            <span className="line-clamp-1">{t("home.searchPlaceholder")}</span>
          </Link>
        )}
        <nav aria-label={t("nav.label")} className="flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 press items-center rounded-xl px-4",
                  active
                    ? "bg-primary-soft font-semibold text-primary-soft-fg"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {t(label)}
              </Link>
            );
          })}
        </nav>
        <Link
          href={routes.add()}
          className="ml-auto flex h-11 press items-center gap-1.5 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
        >
          <PlusIcon className="size-4" strokeWidth={2.6} aria-hidden />
          {t("nav.add")}
        </Link>
      </div>
    </header>
  );
}

"use client";

import { ShareIcon } from "lucide-react";
import { toast } from "sonner";

import { useShare } from "@/hooks/use-share";
import { useT } from "@/i18n/client";

/** 44px round share button (docs/design/C-Food). `path` is the page being shared. */
export function ShareButton({ title, path }: { title: string; path: string }) {
  const t = useT();
  const share = useShare();
  async function onClick() {
    const result = await share({ title, path });
    if (result === "copied") toast.success(t("share.copied"));
    if (result === "failed") toast.error(t("errors.unknown"));
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("share.label")}
      className="flex size-11 press items-center justify-center rounded-full border border-border bg-card"
    >
      <ShareIcon className="size-[19px]" aria-hidden />
    </button>
  );
}

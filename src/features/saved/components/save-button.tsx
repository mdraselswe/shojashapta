"use client";

import { BookmarkIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toast } from "@/lib/toast";

import { routes } from "@/config/routes";
import { useT } from "@/i18n/client";
import { cn } from "@/lib/cn";

import { toggleSaved } from "../actions";

/** 44px round "খেতে চাই" bookmark (docs/design/C-Food). Optimistic; signed-out taps go to login. */
export function SaveButton({
  entity,
  entityId,
  initialSaved,
}: {
  entity: "food" | "place";
  entityId: string;
  initialSaved: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [saved, setSaved] = useOptimistic(initialSaved, (_, next: boolean) => next);

  function toggle() {
    startTransition(async () => {
      setSaved(!saved);
      const result = await toggleSaved({ entity, entityId });
      if (result.ok) {
        toast.success(t(result.data.saved ? "save.added" : "save.removed"));
        router.refresh();
        return;
      }
      if (result.error.code === "auth_required") {
        router.push(routes.login({ next: pathname }));
        return;
      }
      toast.error(t(`errors.${result.error.code}`));
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={t("save.label")}
      className={cn(
        "flex size-11 press items-center justify-center rounded-full border",
        saved
          ? "border-primary-soft bg-primary-soft text-primary-soft-fg"
          : "border-border bg-card",
      )}
    >
      <BookmarkIcon className="size-[19px]" fill={saved ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

export function SaveButtonSkeleton() {
  return <div aria-hidden className="size-11 rounded-full border border-border bg-card" />;
}

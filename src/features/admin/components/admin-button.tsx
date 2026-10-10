"use client";

import { useRouter } from "next/navigation";
import { useTransition, type ComponentProps } from "react";
import { toast } from "@/lib/toast";

import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/client";

import { adminAct } from "../actions";

type Payload = Parameters<typeof adminAct>[0];

/** Runs one admin action, then refreshes the queue. Used for every button on the admin pages. */
export function AdminButton({
  payload,
  children,
  variant = "outline",
  size = "sm",
  confirm,
}: {
  payload: Payload;
  children: React.ReactNode;
  variant?: ComponentProps<typeof Button>["variant"];
  size?: ComponentProps<typeof Button>["size"];
  /** Ask first (merge, ban…). */
  confirm?: string;
}) {
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function run() {
    if (confirm && !window.confirm(confirm)) return;
    startTransition(async () => {
      const result = await adminAct(payload);
      if (result.ok) {
        toast.success(t("admin.done"));
        router.refresh();
      } else {
        toast.error(t(`errors.${result.error.code}`));
      }
    });
  }

  return (
    <Button type="button" variant={variant} size={size} disabled={pending} onClick={run}>
      {children}
    </Button>
  );
}

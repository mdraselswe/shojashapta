"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import type { Verdict, WrongReason } from "@/core/domain";
import { useT } from "@/i18n/client";

import { voteClaim } from "../actions";

/** Shared vote call: handles login redirects, errors and the thank-you toast. */
export function useVote(claimId: string) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function vote(
    input: {
      verdict: Verdict;
      reason?: WrongReason | null;
      note?: string | null;
      evidenceUrl?: string | null;
    },
    onDone?: () => void,
  ) {
    startTransition(async () => {
      const result = await voteClaim({ claimId, ...input });
      if (result.ok) {
        toast.success(t(result.data.confirmedNow ? "verify.confirmed" : "verify.thanks"));
        onDone?.();
        return;
      }
      if (result.error.code === "auth_required") {
        router.push(routes.login({ next: pathname }));
        return;
      }
      toast.error(t(`errors.${result.error.code}`));
    });
  }

  return { vote, pending };
}

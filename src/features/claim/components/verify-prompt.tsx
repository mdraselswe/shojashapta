"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/config/routes";
import type { Verdict, WrongReason } from "@/core/domain";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/t";
import { cn } from "@/lib/cn";

import { voteClaim } from "../actions";

const VERDICTS: { id: Verdict; label: MessageKey; ink: string }[] = [
  { id: "correct", label: "verify.correct", ink: "text-success-fg" },
  { id: "partial", label: "verify.partial", ink: "text-warning-fg" },
  { id: "wrong", label: "verify.wrong", ink: "text-danger-fg" },
];
const REASONS: WrongReason[] = [
  "not_available",
  "wrong_price",
  "wrong_location",
  "closed",
  "other",
];

/** Shared vote call: handles login redirects, errors and the thank-you toast. */
function useVote(claimId: string) {
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

/** One tap: "এখনও ঠিক আছে?" on a claim whose freshness window has passed. */
export function StillCorrectButton({ claimId }: { claimId: string }) {
  const t = useT();
  const { vote, pending } = useVote(claimId);
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => vote({ verdict: "correct" })}
      className="h-9 press rounded-full bg-primary px-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
    >
      {t("verify.stillOk")}
    </button>
  );
}

/** "তথ্য ঠিক আছে?": ঠিক / আংশিক / ভুল, then why, a note and an optional link (docs/design/C-Place). */
export function VerifyPrompt({ claimId, summary }: { claimId: string; summary: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>("correct");
  const [reason, setReason] = useState<WrongReason>("other");
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const { vote, pending } = useVote(claimId);
  const wrongish = verdict !== "correct";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="h-9 press rounded-full border border-border bg-card px-3.5 text-sm font-semibold"
        >
          {t("verify.open")}
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="text-heading">{t("verify.title")}</SheetTitle>
        <SheetDescription>{summary}</SheetDescription>

        <div
          role="group"
          aria-label={t("verify.title")}
          className="grid grid-cols-3 gap-2 rounded-2xl bg-background p-1"
        >
          {VERDICTS.map(({ id, label, ink }) => (
            <button
              key={id}
              type="button"
              aria-pressed={verdict === id}
              onClick={() => setVerdict(id)}
              className={cn(
                "h-12 rounded-xl text-[15px] font-semibold",
                verdict === id ? cn("bg-card shadow-segment", ink) : "text-foreground",
              )}
            >
              {t(label)}
            </button>
          ))}
        </div>

        {wrongish && (
          <>
            <p className="text-[15px] font-semibold">{t("verify.which")}</p>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={reason === id}
                  onClick={() => setReason(id)}
                  className={cn(
                    "h-10 rounded-full px-3.5 text-sm",
                    reason === id
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card",
                  )}
                >
                  {t(`verify.reasons.${id}`)}
                </button>
              ))}
            </div>
            <input
              aria-label={t("verify.note")}
              placeholder={t("verify.note")}
              maxLength={300}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="h-12 w-full rounded-input border border-border bg-background px-3.5 text-base"
            />
            <input
              aria-label={t("verify.evidence")}
              placeholder={t("verify.evidence")}
              inputMode="url"
              value={link}
              onChange={(event) => setLink(event.target.value)}
              className="h-12 w-full rounded-input border border-border bg-background px-3.5 text-base"
            />
          </>
        )}

        <button
          type="button"
          disabled={pending}
          onClick={() =>
            vote(
              {
                verdict,
                reason: wrongish ? reason : null,
                note: wrongish ? note || null : null,
                evidenceUrl: wrongish ? link || null : null,
              },
              () => setOpen(false),
            )
          }
          className="h-14 w-full press rounded-button bg-primary text-[17px] font-semibold text-primary-foreground disabled:opacity-60"
        >
          {t("verify.submit")}
        </button>
      </SheetContent>
    </Sheet>
  );
}

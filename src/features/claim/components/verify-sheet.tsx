"use client";

import { useState } from "react";

import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { Verdict, WrongReason } from "@/core/domain";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/t";
import { cn } from "@/lib/cn";

import { useVote } from "./use-vote";

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

/** "তথ্য ঠিক আছে?": ঠিক / আংশিক / ভুল, then why, a note and an optional link (docs/design/C-Place). */
export function VerifySheet({
  claimId,
  summary,
  onClose,
}: {
  claimId: string;
  summary: string;
  onClose: () => void;
}) {
  const t = useT();
  const [verdict, setVerdict] = useState<Verdict>("correct");
  const [reason, setReason] = useState<WrongReason>("other");
  const [note, setNote] = useState("");
  const [link, setLink] = useState("");
  const { vote, pending } = useVote(claimId);
  const wrongish = verdict !== "correct";

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
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
              onClose,
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

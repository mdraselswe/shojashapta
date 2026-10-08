"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { useT } from "@/i18n/client";

import { useVote } from "./use-vote";

// The sheet (and the dialog library behind it) loads on the first tap, keeping it out of the
// place page's first paint.
const VerifySheet = dynamic(() => import("./verify-sheet").then((mod) => mod.VerifySheet), {
  ssr: false,
});

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

/** The "যাচাই করুন" button; the full sheet opens from it. */
export function VerifyPrompt({ claimId, summary }: { claimId: string; summary: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="h-9 press rounded-full border border-border bg-card px-3.5 text-sm font-semibold"
      >
        {t("verify.open")}
      </button>
      {open && <VerifySheet claimId={claimId} summary={summary} onClose={() => setOpen(false)} />}
    </>
  );
}

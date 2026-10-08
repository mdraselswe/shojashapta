"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { useT } from "@/i18n/client";

import type { Field, Target } from "./content-sheets";

// Both sheets load on the first tap, so the place and food pages do not pay for them up front.
const SuggestEditSheet = dynamic(
  () => import("./content-sheets").then((mod) => mod.SuggestEditSheet),
  { ssr: false },
);
const ReportSheet = dynamic(() => import("./content-sheets").then((mod) => mod.ReportSheet), {
  ssr: false,
});

const TRIGGER = "h-11 press rounded-full border border-border bg-card px-4 text-sm font-semibold";

/** "ভুল কিছু দেখছেন?": suggest a correction or report, at the bottom of place and food pages. */
export function ContentActions({ target, fields }: { target: Target; fields: Field[] }) {
  const t = useT();
  const [open, setOpen] = useState<"edit" | "report" | null>(null);
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={TRIGGER} onClick={() => setOpen("edit")}>
        {t("moderation.suggest")}
      </button>
      <button type="button" className={TRIGGER} onClick={() => setOpen("report")}>
        {t("moderation.report")}
      </button>
      {open === "edit" && (
        <SuggestEditSheet target={target} fields={fields} onClose={() => setOpen(null)} />
      )}
      {open === "report" && <ReportSheet target={target} onClose={() => setOpen(null)} />}
    </div>
  );
}

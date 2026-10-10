"use client";

import { usePathname, useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { toast } from "@/lib/toast";

import { routes } from "@/config/routes";
import { useT } from "@/i18n/client";
import type { MessageKey } from "@/i18n/t";
import { cn } from "@/lib/cn";
import type { Reaction } from "@/core/domain";

import { showReward } from "@/features/reward/show-reward";

import { addExperience } from "../actions";
import { REACTION_HEADING_CLASS } from "./reaction-styles";

export type DishOption = { dishId: string; label: string };

// 😋 😐 👎 as in docs/design/C-Food: ink and fill follow the status tokens, never colour alone.
const REACTIONS: readonly { id: Reaction; label: MessageKey; tone: string }[] = [
  {
    id: "loved",
    label: "reaction.lovedShort",
    tone: "border-success bg-success-soft text-success-fg",
  },
  {
    id: "okay",
    label: "reaction.okayShort",
    tone: "border-warning bg-warning-soft text-warning-fg",
  },
  {
    id: "disliked",
    label: "reaction.dislikedShort",
    tone: "border-danger bg-danger-soft text-danger-fg",
  },
];

function Face({ reaction }: { reaction: Reaction }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="16" cy="16" r="13" />
      {reaction === "loved" && (
        <path d="M10 18c1.5 3 3.5 4.5 6 4.5s4.5-1.5 6-4.5z" fill="currentColor" />
      )}
      {reaction === "okay" && <path d="M11 20h10" />}
      {reaction === "disliked" && <path d="M11 22c1.4-2.2 3-3.2 5-3.2s3.6 1 5 3.2" />}
      <path d="M11 12.5v1M21 12.5v1" />
    </svg>
  );
}

/**
 * "আপনি খেয়েছেন? কেমন লাগল?": the reaction buttons. With one dish a tap saves straight away; with
 * several (a food page lists many places) the person picks where they ate, then confirms. Signed-out
 * visitors are sent to log in and brought back.
 */
export function ReactionPicker({ options }: { options: DishOption[] }) {
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [picked, setPicked] = useState<Reaction | null>(null);
  const [dishId, setDishId] = useState(options[0]?.dishId ?? "");
  const single = options.length <= 1;
  const headingId = useId();
  const selectId = useId();

  function save(reaction: Reaction, forDish: string) {
    setPicked(reaction);
    startTransition(async () => {
      const result = await addExperience({ dishId: forDish, reaction });
      if (result.ok) {
        showReward(
          t,
          result.data.reward,
          t(result.data.isNew ? "experience.added" : "experience.updated"),
        );
        return;
      }
      setPicked(null);
      if (result.error.code === "auth_required") {
        router.push(routes.login({ next: pathname }));
        return;
      }
      toast.error(t(`errors.${result.error.code}`));
    });
  }

  if (options.length === 0) return null;

  return (
    <div>
      <p className={REACTION_HEADING_CLASS} id={headingId}>
        {t("experience.question")}
      </p>
      <div role="group" aria-labelledby={headingId} className="mt-2.5 grid grid-cols-3 gap-2">
        {REACTIONS.map(({ id, label, tone }) => {
          const on = picked === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              disabled={pending}
              onClick={() => (single ? save(id, dishId) : setPicked(id))}
              className={cn(
                "flex h-21 press flex-col items-center justify-center gap-1 rounded-[18px] border-2 text-[15px] font-semibold transition-colors",
                on ? tone : "border-transparent bg-background text-foreground",
              )}
            >
              <Face reaction={id} />
              {t(label)}
            </button>
          );
        })}
      </div>

      {!single && picked !== null && (
        <div className="mt-3.5">
          <label htmlFor={selectId} className="text-meta font-semibold">
            {t("experience.where")}
          </label>
          <select
            id={selectId}
            value={dishId}
            onChange={(event) => setDishId(event.target.value)}
            className="mt-1.5 h-12 w-full rounded-input border border-border bg-card px-3 text-base"
          >
            {options.map((option) => (
              <option key={option.dishId} value={option.dishId}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending}
            onClick={() => save(picked, dishId)}
            className="mt-3 flex h-12 w-full press items-center justify-center rounded-button bg-primary text-base font-semibold text-primary-foreground disabled:opacity-60"
          >
            {t("experience.submit")}
          </button>
        </div>
      )}
    </div>
  );
}

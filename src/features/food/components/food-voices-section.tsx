import { Section } from "@/components/layout/section";
import { GroupedList } from "@/components/ui/grouped-list";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import type { Reaction } from "@/core/domain";
import { getT } from "@/i18n/server";
import { timeAgo } from "@/lib/format/date";
import { formatTaka } from "@/lib/format/number";

import { getFoodExperiences } from "../queries";

const REACTION_EMOJI: Record<Reaction, string> = { loved: "😍", okay: "🙂", disliked: "😕" };
const SKELETON_ROWS = 2;
const ITEM_CLASS = "flex gap-3 p-3";

/** "মানুষ যা বলছেন": the latest written experiences. Names are display names only. */
export async function FoodVoicesSection({ foodId }: { foodId: string }) {
  const t = getT();
  const { items: experiences, asOf } = await getFoodExperiences(foodId);
  if (experiences.length === 0) return null;
  return (
    <Section title={t("food.voices")}>
      <GroupedList>
        {experiences.map((experience) => (
          <li key={experience.id} className={ITEM_CLASS}>
            <span aria-hidden className="text-2xl leading-none">
              {REACTION_EMOJI[experience.reaction]}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body">
                <span className="sr-only">{t(`reaction.${experience.reaction}`)}: </span>
                {experience.comment}
              </p>
              <p className="mt-1 text-caption text-muted-foreground">
                {[
                  experience.userName,
                  experience.pricePaid !== null ? formatTaka(experience.pricePaid) : null,
                  timeAgo(experience.createdAt, asOf),
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
          </li>
        ))}
      </GroupedList>
    </Section>
  );
}

export function FoodVoicesSectionSkeleton() {
  const t = getT();
  return (
    <Section title={t("food.voices")}>
      <GroupedList>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <li key={index} className={ITEM_CLASS}>
            <Skeleton className="size-6 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <SkeletonText lines={2} className="text-body" />
              <SkeletonText className="mt-1 w-1/2 text-caption" />
            </div>
          </li>
        ))}
      </GroupedList>
    </Section>
  );
}

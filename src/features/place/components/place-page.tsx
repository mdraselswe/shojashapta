import { Suspense } from "react";

import { PageShell } from "@/components/layout/page-shell";
import { SubPageBar } from "@/components/layout/sub-page-bar";
import { LoadingRegion } from "@/components/ui/skeleton";
import { routes } from "@/config/routes";
import { getT } from "@/i18n/server";
import type { PlaceHeader } from "@/services/catalog-service";

import {
  PlaceReactionCard,
  ReactionCardSkeleton,
} from "@/features/experience/components/reaction-card";
import { SaveButtonSkeleton } from "@/features/saved/components/save-button";
import { SaveControl } from "@/features/saved/components/save-control";
import { Section } from "@/components/layout/section";
import { ContentActions } from "@/features/moderation/components/content-actions";
import { PlaceClaimsSection, PlaceClaimsSectionSkeleton } from "./place-claims-section";
import { PlaceDishesSection, PlaceDishesSectionSkeleton } from "./place-dishes-section";
import { PlaceHero, PlaceHeroSkeleton } from "./place-hero";
import { PlaceInfoSection } from "./place-info-section";
import { PlacePhotosSection } from "./place-photos-section";

/** Place page: hero and info are ready with the header; claims and dishes stream in. */
export function PlacePage({ place }: { place: PlaceHeader }) {
  const t = getT();
  return (
    <PageShell
      header={
        <SubPageBar
          backHref={routes.district(place.district.slug)}
          actions={
            <Suspense fallback={<SaveButtonSkeleton />}>
              <SaveControl entity="place" entityId={place.id} />
            </Suspense>
          }
          crumbs={[
            { label: place.district.nameBn, href: routes.district(place.district.slug) },
            { label: place.nameBn },
          ]}
        />
      }
    >
      <PlaceHero place={place} />
      <Suspense fallback={<PlaceClaimsSectionSkeleton />}>
        <PlaceClaimsSection placeId={place.id} />
      </Suspense>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Suspense fallback={<PlaceDishesSectionSkeleton />}>
            <PlaceDishesSection placeId={place.id} />
          </Suspense>
        </div>
        <div className="lg:col-span-5">
          <div className="page-x pt-6 lg:pt-10">
            <Suspense fallback={<ReactionCardSkeleton />}>
              <PlaceReactionCard placeId={place.id} />
            </Suspense>
          </div>
          <PlaceInfoSection place={place} />
          <Section title={t("moderation.moreTitle")}>
            <ContentActions
              target={{ entity: "place", entityId: place.id }}
              fields={[
                { id: "name_bn", current: place.nameBn },
                { id: "address", current: place.address },
                { id: "type", current: t(`placeType.${place.type}`) },
              ]}
            />
          </Section>
        </div>
      </div>
      <Suspense fallback={null}>
        <PlacePhotosSection placeId={place.id} />
      </Suspense>
    </PageShell>
  );
}

export function PlacePageSkeleton() {
  const t = getT();
  return (
    <LoadingRegion label={t("common.loading")}>
      <PageShell header={<SubPageBar backHref={routes.home()} />}>
        <PlaceHeroSkeleton />
        <PlaceClaimsSectionSkeleton />
        <PlaceDishesSectionSkeleton />
      </PageShell>
    </LoadingRegion>
  );
}

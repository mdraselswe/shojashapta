import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/url";

// Structured data (docs/08-seo-performance-pwa.md §1). Plain objects, no framework: the <JsonLd>
// component prints them. Never invents data: no ratings, no opening hours we do not store.

type Crumb = { name: string; path: string };

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/** Home page: the site itself, with the search box Google can show under the result. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: siteConfig.nameLatin,
    url: absoluteUrl("/"),
    inLanguage: "bn",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

type PlaceLdInput = {
  slug: string;
  nameBn: string;
  nameEn: string | null;
  type: "restaurant" | "shop" | "street_food" | "bakery" | "home_kitchen" | "other";
  districtNameBn: string;
  address: string | null;
  location?: { lat: number; lng: number } | null;
};

const PLACE_LD_TYPE: Record<PlaceLdInput["type"], string> = {
  restaurant: "Restaurant",
  bakery: "Bakery",
  shop: "FoodEstablishment",
  street_food: "FoodEstablishment",
  home_kitchen: "FoodEstablishment",
  other: "FoodEstablishment",
};

export function placeLd(place: PlaceLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": PLACE_LD_TYPE[place.type],
    name: place.nameBn,
    ...(place.nameEn ? { alternateName: place.nameEn } : {}),
    url: absoluteUrl(`/place/${encodeURIComponent(place.slug)}`),
    address: {
      "@type": "PostalAddress",
      ...(place.address ? { streetAddress: place.address } : {}),
      addressLocality: place.districtNameBn,
      addressCountry: "BD",
    },
    ...(place.location
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: place.location.lat,
            longitude: place.location.lng,
          },
        }
      : {}),
  };
}

export function itemListLd(name: string, items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

/** JSON for a <script type="application/ld+json">: "<" is escaped so content can never close the tag. */
export function serializeLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

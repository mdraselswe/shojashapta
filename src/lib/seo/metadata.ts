import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/url";

/** The subset of Next's `Metadata` the app uses (structurally compatible; lib/ stays framework-free). */
export type PageMetadata = {
  title?: string;
  description: string;
  alternates: { canonical: string };
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    locale: string;
    type: "website" | "article";
    images?: { url: string; width?: number; height?: number; alt?: string }[];
  };
  twitter: { card: "summary_large_image"; title: string; description: string; images?: string[] };
  robots?: { index: boolean; follow: boolean };
};

type Input = {
  /** Page title; the root layout's template appends the site name. Omit for the home page. */
  title?: string;
  description: string;
  /** Path of this page, e.g. "/food/doi" — becomes the canonical URL. */
  path: string;
  /** Absolute or site-relative image URL; defaults to the file-based OG image. */
  image?: string;
  /** Thin or private pages: keep out of search results. */
  noindex?: boolean;
};

export function buildMetadata({ title, description, path, image, noindex }: Input): PageMetadata {
  const url = absoluteUrl(path);
  const shownTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.tagline}`;
  const images = image ? [{ url: absoluteUrl(image) }] : undefined;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: url },
    openGraph: {
      title: shownTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: shownTitle,
      description,
      ...(images ? { images: images.map((entry) => entry.url) } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

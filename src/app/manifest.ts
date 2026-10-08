import type { MetadataRoute } from "next";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";

// Installable on Android Chrome; no offline mode in the MVP (docs/08-seo-performance-pwa.md §3).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.nameLatin} — ${siteConfig.name}`,
    short_name: siteConfig.nameLatin,
    description: siteConfig.description,
    lang: "bn",
    dir: "ltr",
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: themes.light.metaColor,
    theme_color: themes.light.metaColor,
    categories: ["food", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "খুঁজুন",
        url: routes.search(),
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "যোগ করুন",
        url: routes.add(),
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}

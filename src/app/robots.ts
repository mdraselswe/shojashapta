import type { MetadataRoute } from "next";

import { clientEnv } from "@/config/env";
import { siteConfig } from "@/config/site";

// Before launch nothing may be crawled; after it, everything public is open and private areas stay out.
export default function robots(): MetadataRoute.Robots {
  if (!clientEnv.NEXT_PUBLIC_LAUNCHED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/me", "/add", "/admin", "/api/", "/auth/", "/dev", "/login", "/search?"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

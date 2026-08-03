import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["fr", "en"].map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: "monthly" as const,
    priority: locale === "fr" ? 1 : 0.9,
    alternates: {
      languages: {
        fr: `${SITE_URL}/fr`,
        en: `${SITE_URL}/en`,
      },
    },
  }));
}

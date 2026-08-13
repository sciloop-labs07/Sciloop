import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sciloop-live.vercel.app";
  return [
    { url: `${base}/sciloop-live`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/live-innovations`, changeFrequency: "hourly", priority: 0.95 },
    { url: `${base}/innovations/google-quantum-chip`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/innovations/crispr-gene-editing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/innovations/solid-state-battery`, changeFrequency: "weekly", priority: 0.9 },
  ];
}

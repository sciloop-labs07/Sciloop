import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sciloop-live.vercel.app";
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/live-innovations`, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/sciloop/live/google-quantum-chip`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sciloop/live/crispr-gene-editing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/sciloop/live/solid-state-battery`, changeFrequency: "weekly", priority: 0.9 },
  ];
}

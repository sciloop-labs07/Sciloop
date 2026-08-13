import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/sciloop-live",
        permanent: false,
      },
      // SciLoop has one public product surface now. Keep the legacy route
      // handlers and APIs intact, but funnel old page URLs into the matching
      // portal inside the canonical single-page UI.
      { source: "/live-innovations", destination: "/sciloop-live#news", permanent: false },
      { source: "/innovations/:slug", destination: "/sciloop-live#news", permanent: false },
      { source: "/visual-language", destination: "/sciloop-live#visual-language", permanent: false },
      { source: "/visual-language-lab", destination: "/sciloop-live#visual-language", permanent: false },
      { source: "/visual-frontier/:path*", destination: "/sciloop-live#visual-language/visual-engine", permanent: false },
      { source: "/mini-experiment-lab", destination: "/sciloop-live#mini-experiment-lab", permanent: false },
      { source: "/simulation-lab", destination: "/sciloop-live#mini-experiment-lab", permanent: false },
      { source: "/content-studio", destination: "/sciloop-live#sciloop-nexus", permanent: false },
      { source: "/knowledge-graph", destination: "/sciloop-live#knowledge-frontier", permanent: false },
      { source: "/director", destination: "/sciloop-live#sciloop-nexus", permanent: false },
      { source: "/evolution", destination: "/sciloop-live#knowledge-frontier", permanent: false },
      { source: "/knowledge-frontier", destination: "/sciloop-live#knowledge-frontier", permanent: false },
      { source: "/potential-explorer", destination: "/sciloop-live#knowledge-frontier/potential-explorer", permanent: false },
      { source: "/local-problem-solver", destination: "/sciloop-live#local-problem-solver", permanent: false },
      { source: "/impact-hub", destination: "/sciloop-live#local-problem-solver/impact", permanent: false },
      { source: "/timeless-problems", destination: "/sciloop-live#local-problem-solver/timeless-problems", permanent: false },
      { source: "/cosmic-simulation", destination: "/sciloop-live#visual-language/cosmic", permanent: false },
      { source: "/unity-ai-sandbox", destination: "/sciloop-live#visual-language", permanent: false },
      { source: "/worlds/:path*", destination: "/sciloop-live#visual-language", permanent: false },
      { source: "/discoveries", destination: "/sciloop-live#news", permanent: false },
      { source: "/about", destination: "/sciloop-live#sciloop-nexus/guide", permanent: false },
      { source: "/platform-guide", destination: "/sciloop-live#sciloop-nexus/guide", permanent: false },
      { source: "/system-status", destination: "/sciloop-live#sciloop-nexus", permanent: false },
      { source: "/sciloop-ai-stream", destination: "/sciloop-live#sciloop-nexus", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;

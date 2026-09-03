import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    // Keep Turbopack inside this repository. Without an explicit root it
    // detects a package-lock above the project and expands the workspace.
    root: __dirname,
  },
  async redirects() {
    return [
      // Keep shareable brief URLs stable while resolving them through the
      // production-proven reviewed-signals route.
      { source: "/sciloop/live/google-quantum-chip", destination: "/live-innovations?signal=google-quantum-chip", permanent: false },
      { source: "/sciloop/live/crispr-gene-editing", destination: "/live-innovations?signal=crispr-gene-editing", permanent: false },
      { source: "/sciloop/live/solid-state-battery", destination: "/live-innovations?signal=solid-state-battery", permanent: false },
      // Historical stories resolve into the canonical React experience. The
      // legacy shell remains available at /sciloop-live as a rollback surface.
      { source: "/innovations/:slug", destination: "/sciloop/live/:slug", permanent: false },
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

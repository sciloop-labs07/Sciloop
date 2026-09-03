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

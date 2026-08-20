import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const isDev = process.env.NODE_ENV === "development";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disabling in dev keeps hot-reload fast and avoids stale service-worker
  // caches confusing you while iterating. We turn it on for
  // production/preview builds, which is also where iPhone HTTPS testing
  // (Vercel preview URLs) happens.
  disable: isDev,
});

const nextConfig: NextConfig = {
  /* config options here */
};

// withSerwist() injects a webpack-specific customization into the config
// object — needed for `next build` (production), but it conflicts with
// Turbopack, which is Next 16's default dev bundler. Since Serwist is
// fully disabled in dev anyway (see `disable` above — no service worker
// is generated or needed there), dev mode simply exports the bare config
// with no webpack customization at all, letting Turbopack run cleanly.
export default isDev ? nextConfig : withSerwist(nextConfig);
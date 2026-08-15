import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disabling in dev keeps hot-reload fast and avoids stale service-worker
  // caches confusing you while iterating. We turn it on for
  // production/preview builds, which is also where iPhone HTTPS testing
  // (Vercel preview URLs) happens.
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwist(nextConfig);

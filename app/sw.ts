/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

// See: /docs — Section 14/E for the reasoning behind this strategy.
//
// - App shell (JS/CSS/fonts): precached + cache-first via defaultCache,
//   because Next.js content-hashes these files, so a cached copy is
//   never stale by definition.
// - Guide pages the user has visited: stale-while-revalidate — show the
//   cached page instantly, then fetch a fresh copy in the background so
//   the *next* visit reflects any update, without ever blocking on the
//   network.
// - Search and any /api/* route: network-only. A search result or a fee
//   figure served from a stale cache is worse than one that visibly
//   fails offline, so we never let those be cached.

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin && url.pathname.startsWith("/api/"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin && url.pathname.startsWith("/search"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url, sameOrigin }) =>
        sameOrigin && url.pathname.startsWith("/guides/"),
      handler: new StaleWhileRevalidate({ cacheName: "camne-guides" }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

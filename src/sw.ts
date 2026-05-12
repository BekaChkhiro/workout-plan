import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
  CacheFirst,
  ExpirationPlugin,
  NetworkFirst,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
} from "serwist";
import { PAGES_CACHE_NAME } from "@serwist/next/worker";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const sw = new Serwist({
  precacheEntries: self.__SW_MANIFEST ?? [],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
          {
            matcher: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: new CacheFirst({
              cacheName: "google-fonts-webfonts",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 4,
                  maxAgeSeconds: 365 * 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          {
            matcher: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: new StaleWhileRevalidate({
              cacheName: "google-fonts-stylesheets",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 4,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          {
            matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
            handler: new StaleWhileRevalidate({
              cacheName: "static-font-assets",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 4,
                  maxAgeSeconds: 7 * 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          // Images: CacheFirst per spec
          {
            matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
            handler: new CacheFirst({
              cacheName: "static-image-assets",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 64,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          {
            matcher: /\/_next\/static.+\.js$/i,
            handler: new CacheFirst({
              cacheName: "next-static-js-assets",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 64,
                  maxAgeSeconds: 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          // next/image: CacheFirst per spec
          {
            matcher: /\/_next\/image\?url=.+$/i,
            handler: new CacheFirst({
              cacheName: "next-image",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 64,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
            }),
          },
          // Auth endpoints — never cache
          {
            matcher: /\/api\/auth\/.*/,
            handler: new NetworkOnly({ networkTimeoutSeconds: 10 }),
          },
          // API routes — NetworkFirst
          {
            matcher: ({ sameOrigin, url: { pathname } }) =>
              sameOrigin && pathname.startsWith("/api/"),
            method: "GET",
            handler: new NetworkFirst({
              cacheName: "apis",
              plugins: [
                new ExpirationPlugin({
                  maxEntries: 16,
                  maxAgeSeconds: 24 * 60 * 60,
                  maxAgeFrom: "last-used",
                }),
              ],
              networkTimeoutSeconds: 10,
            }),
          },
          // RSC prefetch requests
          {
            matcher: ({ request, url: { pathname }, sameOrigin }) =>
              request.headers.get("RSC") === "1" &&
              request.headers.get("Next-Router-Prefetch") === "1" &&
              sameOrigin &&
              !pathname.startsWith("/api/"),
            handler: new NetworkFirst({
              cacheName: PAGES_CACHE_NAME.rscPrefetch,
              plugins: [
                new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 }),
              ],
            }),
          },
          // RSC requests
          {
            matcher: ({ request, url: { pathname }, sameOrigin }) =>
              request.headers.get("RSC") === "1" &&
              sameOrigin &&
              !pathname.startsWith("/api/"),
            handler: new NetworkFirst({
              cacheName: PAGES_CACHE_NAME.rsc,
              plugins: [
                new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 }),
              ],
            }),
          },
          // Navigation: NetworkFirst; offline fallback handled below
          {
            matcher: ({ request, url: { pathname }, sameOrigin }) =>
              request.headers.get("Content-Type")?.includes("text/html") === true &&
              sameOrigin &&
              !pathname.startsWith("/api/"),
            handler: new NetworkFirst({
              cacheName: PAGES_CACHE_NAME.html,
              plugins: [
                new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 }),
              ],
            }),
          },
          {
            matcher: ({ url: { pathname }, sameOrigin }) =>
              sameOrigin && !pathname.startsWith("/api/"),
            handler: new NetworkFirst({
              cacheName: "others",
              plugins: [
                new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 24 * 60 * 60 }),
              ],
            }),
          },
          {
            matcher: ({ sameOrigin }) => !sameOrigin,
            handler: new NetworkFirst({
              cacheName: "cross-origin",
              plugins: [
                new ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
              ],
              networkTimeoutSeconds: 10,
            }),
          },
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

sw.addEventListeners();

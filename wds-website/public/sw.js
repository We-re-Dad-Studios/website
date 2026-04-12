// public/sw.js
// Hand-rolled service worker for WDS. Three caching strategies:
//   1. App shell / static assets  → stale-while-revalidate
//   2. Chapter pages               → cache-first with background update
//   3. Contentful images           → cache-first, 30-day TTL
// Everything else is network-only.

const VERSION = "wds-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const CHAPTER_CACHE = `${VERSION}-chapters`;
const IMAGE_CACHE = `${VERSION}-images`;
const OFFLINE_URL = "/offline";

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/images/WDS LOGO WHITE.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isChapterUrl(url) {
  return /\/novels\/[^/]+\/chapters\/[^/]+/.test(url.pathname);
}

function isContentfulImage(url) {
  return url.hostname === "images.ctfassets.net";
}

function isStaticAsset(url) {
  return (
    url.origin === self.location.origin &&
    /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname)
  );
}

function isAppNavigation(request) {
  return request.mode === "navigate";
}

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

async function cacheFirst(cacheName, request) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    // Background refresh.
    fetch(request)
      .then((response) => {
        if (response && response.ok) cache.put(request, response.clone());
      })
      .catch(() => {});
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never intercept analytics / third-party APIs.
  if (
    url.pathname.startsWith("/ingest/") ||
    url.hostname.includes("posthog") ||
    url.hostname.includes("disqus") ||
    url.hostname.includes("ko-fi") ||
    url.hostname.includes("resend") ||
    url.hostname.includes("contentful.com")
  ) {
    return;
  }

  if (isChapterUrl(url)) {
    event.respondWith(
      cacheFirst(CHAPTER_CACHE, request).then((resp) => {
        if (!resp || resp.type === "error") {
          return caches.match(OFFLINE_URL).then((m) => m || Response.error());
        }
        return resp;
      })
    );
    return;
  }

  if (isContentfulImage(url)) {
    event.respondWith(cacheFirst(IMAGE_CACHE, request));
    return;
  }

  if (isAppNavigation(request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(SHELL_CACHE, request));
    return;
  }
});

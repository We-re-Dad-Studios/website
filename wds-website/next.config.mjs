import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const projectRoot = fileURLToPath(new URL("./", import.meta.url));

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self';",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.ko-fi.com https://*.disqus.com https://*.disquscdn.com;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://storage.ko-fi.com;",
      "font-src 'self' data: https://fonts.gstatic.com;",
      "img-src 'self' data: https: https://images.ctfassets.net https://*.disquscdn.com;",
      "media-src 'self' blob: https://assets.ctfassets.net;",
      "connect-src 'self' https://cdn.contentful.com https://preview.contentful.com https://storage.ko-fi.com https://*.disqus.com;",
      "frame-src https://ko-fi.com https://storage.ko-fi.com https://disqus.com https://*.disqus.com;",
      "worker-src 'self';",
      "manifest-src 'self';",
      "frame-ancestors 'none';",
      "base-uri 'self';",
      "form-action 'self';",
    ].join(" "),
  },

  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "unsafe-none" },
  { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
];

// [old slug, new slug] — see redirects() below.
const DAWNSHIPPER_RENAMED_CHAPTERS = [
  ["the-stage-on-the-railway", "a-clear-winner"],
  ["the-judgement-at-port-azure", "the-unbound"],
  ["the-shadow-beneath-the-celebration", "the-wanderer"],
  ["smoke-over-port-azure", "not-while-i-live"],
  ["the-square-that-burned", "i-was-invited"],
  ["shattered-pieces", "a-story-for-the-papers"],
  ["the-silence-at-home", "blueprint-and-bloodlines"],
  ["the-highlords-invitation", "small-mercies"],
  ["a-seat-among-lions", "what-found-him-in-the-dark"],
  ["blueprints-and-faultlines", "the-defector"],
  ["sugar-smoke-and-shadows", "the-boy-who-dreamed"],
  ["the-defectors-shadow", "seeds-of-resistance"],
  ["the-knife-in-the-dark", "lets-steal-an-echo"],
  ["the-man-in-the-tunnel", "the-book-of-names"],
  ["the-weight-of-whats-hidden", "sleight-of-hand"],
  ["the-crowd-at-the-gates", "the-price-of-three-echoes"],
  ["the-plan-before-dawn", "insurance"],
  ["before-the-coves", "it-wasnt-my-fault"],
  ["the-hunters-blind-spot", "the-mark-of-chaos"],
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  distDir: "build",
  outputFileTracingRoot: projectRoot,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Service worker must always be fresh so SW updates propagate.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net", port: "" },
      { protocol: "https", hostname: "*", port: "" },
    ],
  },
  // Dawnshipper chapters 2–20 were re-titled when the book was re-imported from
  // the master Google Doc (Oct 2026). Old links go to the chapter now at the same number.
  async redirects() {
    return DAWNSHIPPER_RENAMED_CHAPTERS.map(([from, to]) => ({
      source: `/novels/dawnshipper/chapters/${from}`,
      destination: `/novels/dawnshipper/chapters/${to}`,
      permanent: true,
    }));
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;

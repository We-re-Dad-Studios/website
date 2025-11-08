/** @type {import('next').NextConfig} */
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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://storage.ko-fi.com;",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://storage.ko-fi.com;",
      "font-src 'self' data: https://fonts.gstatic.com;",
      "img-src 'self' data: https: https://images.ctfassets.net;",
      "connect-src 'self' https://cdn.contentful.com https://preview.contentful.com https://storage.ko-fi.com;",
      "frame-src https://ko-fi.com https://storage.ko-fi.com;",
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

const nextConfig = {
  distDir: "build",

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net", port: "" },
      { protocol: "https", hostname: "*", port: "" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
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

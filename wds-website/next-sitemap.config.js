/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://weredadstudios.com",
  generateRobotsTxt: true,

  // DO NOT SET sourceDir — let next-sitemap auto-detect the custom distDir
  outDir: "./public",

  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 7000,
  autoLastmod: true,

  exclude: ["/api/*", "/server-sitemap.xml"],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    additionalSitemaps: [
      "https://weredadstudios.com/sitemap.xml",
    ],
  },

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1.0 : 0.8,
      lastmod: new Date().toISOString(),
    };
  },
};

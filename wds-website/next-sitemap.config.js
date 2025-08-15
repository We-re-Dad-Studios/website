/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://weredadstudios.com', // replace with your domain
    generateRobotsTxt: true, // optional but recommended
    changefreq: 'daily',
    priority: 0.7,
    sitemapSize: 7000,
    outDir: './public', // optional: where the sitemap will go
    sourceDir: 'build',
  };


  
/** @type {import('next').NextConfig} */
const nextConfig = {
  
  distDir: 'build',
  images:{
      
    remotePatterns:[
        {protocol:"https",
        hostname:"images.ctfassets.net",
        port:"",},
        {protocol:"https",
            hostname:"*",
            port:"",}
        

    ]
  
},
  async rewrites(){
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
    ]
  },
  skipTrailingSlashRedirect: true
};
  
export default nextConfig;

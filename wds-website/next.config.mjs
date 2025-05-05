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
  
}
  };
  
 
export default nextConfig;

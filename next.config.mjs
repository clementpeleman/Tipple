/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'utfs.io',
      port: ''
    },
    {
      protocol: 'https',
      hostname: 'api.slingacademy.com',
      port: ''
    },
    {
      hostname: 'randomuser.me'
    },
    {
      hostname: 'www.crombewines.com'
    }],
  },
};

export default nextConfig;

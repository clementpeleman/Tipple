/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "api.slingacademy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "www.crombewines.com",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:12000', 'localhost:12001', 'work-1-dljmpvhshlxcijzk.prod-runtime.all-hands.dev', 'work-2-dljmpvhshlxcijzk.prod-runtime.all-hands.dev'],
    },
  },
};

export default nextConfig;

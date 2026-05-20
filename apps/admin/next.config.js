/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@thien-nam/ui-shared"],
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3001"],
    },
  },
};

module.exports = nextConfig;

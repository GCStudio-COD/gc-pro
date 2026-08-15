import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // Set to true if you want it to be a 308 permanent redirect
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: any = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@ethsltd/api-client", "@ethsltd/types"],
  serverExternalPackages: ["sharp"],
  async rewrites() {
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.BACKEND_API_URL || (isProd ? 'https://api.ethsltd.com' : 'http://localhost:3001');
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

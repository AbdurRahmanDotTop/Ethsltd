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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://api.ethsltd.com';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${apiUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;

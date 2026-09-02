import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.CF_PAGES_URL,
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev());

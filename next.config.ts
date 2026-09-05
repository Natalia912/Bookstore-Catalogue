import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'llyofgpebxcuodtnacsc.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.CF_PAGES_URL,
  },
};

const withNextIntl = createNextIntlPlugin('./src/shared/configs/i18n/request.ts');

export default withNextIntl(nextConfig);

import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev());

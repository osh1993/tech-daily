import type { NextConfig } from "next";
import withPWAInit from '@ducanh2912/next-pwa';

// 번들 분석기
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// PWA 설정
const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  // Turbopack 설정 (Next.js 16+)
  turbopack: {},

  // 이미지 최적화 설정
  images: {
    // 외부 이미지 도메인 허용
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 도메인 허용 (RSS 피드 이미지)
      },
      {
        protocol: 'http',
        hostname: '**', // 모든 HTTP 도메인 허용
      },
    ],
    // 이미지 포맷 (WebP, AVIF 자동 변환)
    formats: ['image/avif', 'image/webp'],
    // 이미지 캐싱 기간 (1년)
    minimumCacheTTL: 31536000,
    // 디바이스 크기별 이미지 사이즈
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 번들 최적화
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // 헤더 설정 (캐싱)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=900, s-maxage=900, stale-while-revalidate=900',
          },
        ],
      },
    ];
  },
};

export default withPWA(withBundleAnalyzer(nextConfig));

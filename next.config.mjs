/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  eslint: {
    // 배포 시 ESLint 오류를 무시 (경고로 처리)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 배포 시 TypeScript 오류를 무시
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demo.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

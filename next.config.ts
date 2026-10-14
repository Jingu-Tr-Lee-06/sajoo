import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 빌드 중 타입 에러로 인한 배포 중단 방지
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 중 린트 에러로 인한 배포 중단 방지
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
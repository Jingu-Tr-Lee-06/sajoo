import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // 빌드 시 타입 에러 무시
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 랜딩은 서버 기능 없이 정적 파일(out/)로 배포한다.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

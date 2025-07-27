import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    cacheComponents: true,
    ppr: true,
  },
};

export default nextConfig;

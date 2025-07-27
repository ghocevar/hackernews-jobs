import { nextFusePlugin } from "fuse/next/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    cacheComponents: true,
    ppr: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextFusePlugin()({
  ...nextConfig,
});

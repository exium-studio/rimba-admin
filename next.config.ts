import type { NextConfig } from "next";
import { IMAGE_REMOTE_PATTERNS } from "@/constants/csp";

const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline.html",
  },
  buildExcludes: [/\.map$/, /asset-manifest\.json$/],
});

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,

  webpack(config, { dev, isServer }) {
    config.resolve.alias.canvas = false;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      stream: false,
      zlib: false,
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }

    if (dev) {
      config.cache = { type: "memory" };
    }

    return config;
  },

  images: {
    remotePatterns: IMAGE_REMOTE_PATTERNS,
    qualities: [60, 70, 80, 90, 100],
  },

  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

module.exports = withPWA(nextConfig);

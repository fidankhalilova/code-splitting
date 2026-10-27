import type { NextConfig } from "next";
import analyzer from "@next/bundle-analyzer";
const withAnalyzer = analyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withAnalyzer(nextConfig);

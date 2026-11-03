import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // The dev badge overlaps the hero's bottom-left status line.
  devIndicators: false,
};

export default nextConfig;

import type { NextConfig } from "next";
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new MiniCssExtractPlugin());
    }

    return config;
  },
};

export default nextConfig;

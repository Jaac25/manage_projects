// next.config.mjs
import MiniCssExtractPlugin from "mini-css-extract-plugin";

export default {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new MiniCssExtractPlugin());
    }

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fnovepaugunlvhgjofaj.supabase.co",
        pathname: "/storage/v1/object/public/**", // Asegúrate de que este patrón sea correcto
      },
    ],
  },
};

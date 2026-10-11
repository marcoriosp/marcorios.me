import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Legacy WordPress URLs all end in "/" (e.g. /portfolio/, /blog/).
  trailingSlash: true,
};

export default nextConfig;

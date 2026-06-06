import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.1.20', '192.168.1.20:3000', 'localhost:3000'],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["ovvtrasavonyhsidimci.supabase.co"],
  },
  serverExternalPackages: ["resend", "svix"],
};

export default nextConfig;

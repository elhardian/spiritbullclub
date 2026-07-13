import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep nodemailer as a Node native dependency (SMTP + TLS)
  serverExternalPackages: ["nodemailer"],
  // Allows `NEXT_DIST_DIR=.next-staging npm run build` during zero-downtime deploys
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;

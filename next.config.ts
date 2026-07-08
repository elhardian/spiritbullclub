import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep nodemailer as a Node native dependency (SMTP + TLS)
  serverExternalPackages: ["nodemailer"],
};

export default nextConfig;

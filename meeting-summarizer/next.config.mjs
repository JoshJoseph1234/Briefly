/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Force Node.js runtime for API routes that use SDKs */
  experimental: {
    serverComponentsExternalPackages: ["groq-sdk", "resend", "nodemailer"]
  }
};
export default nextConfig;

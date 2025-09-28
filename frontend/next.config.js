/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    TIKTOK_CLIENT_ID: process.env.TIKTOK_CLIENT_ID,
    TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
  },
};

module.exports = nextConfig;

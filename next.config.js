/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_KEY: process.env.WALLET_ID,
  },
};

module.exports = nextConfig;

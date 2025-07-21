/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  onDemandEntries: {
    maxInactiveAge: 1000 * 60 * 60, // 1 hour
    pagesBufferLength: 5,
  },
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;

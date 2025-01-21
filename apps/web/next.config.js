/* eslint-env node */
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // Add any image domains you need here
  },
  transpilePackages: [
    "@greatforai/ai-core",
    "@greatforai/core",
    "@greatforai/database",
    "@greatforai/ui"
  ],
  output: 'standalone',
  outputFileTracingRoot: '.',
  experimental: {
    externalDir: true
  }
};

export default nextConfig;